import { STORAGE_KEYS } from '@/constants/app-constant';
import { usePersonalUtilitiesStore } from '@/hooks/use-personal-utility-store';
import { useOrganizationUtilitiesStore } from '@/hooks/use-organization-utility-store';
import { UserResponse } from '@/interfaces/user-interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  fetchClient,
  updateWireConfig,
  useMutationFn,
} from 'fetchwire';
import { loginApi } from '@/apis/auth-apis';

interface AuthContextType {
  isLoading: boolean;
  currentUser: UserResponse | null;
  performLogin: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<boolean>;
  performLogout: () => Promise<void>;
  performSync: (user: UserResponse) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  currentUser: null,
  performLogin: async () => false,
  performLogout: async () => {},
  performSync: async () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { executeMutationFn: signIn } = useMutationFn(
    ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password)
  );
  const performLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await signIn(
        { email, password },
        {
          onError: (error) => {
            if (error.statusCode === 401) {
              Alert.alert(
                'Đăng nhập thất bại',
                'Email hoặc mật khẩu không chính xác'
              );
              return;
            }
            Alert.alert('Đăng nhập thất bại', error.message || 'Lỗi không xác định');
          },
        },
      );

      if (response && response.status === 200 && response.data?.user) {
        const user = response.data.user;
        const accessToken = response.data.accessToken;
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem(STORAGE_KEYS.currentUser, jsonValue);
        await AsyncStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
        // wait for storage to complete before updating state to avoid race conditions
        // in organization provider which depends on currentUser to fetch organizations using token
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const performLogout = async () => {
    setIsLoading(true);
    try {
      setCurrentUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.currentUser);
      await AsyncStorage.removeItem(STORAGE_KEYS.accessToken);
      usePersonalUtilitiesStore.persist.clearStorage();
      useOrganizationUtilitiesStore.persist.clearStorage();
      fetchClient.clear();
    } catch (error) {
      console.error('Error performing logout', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateWireConfig({
      interceptors: {
        onError: async (error) => {
          if (error.errorCode === 'TOKEN_INVALID') {
            await performLogout();
          }
        },
      },
    });
  }, []);

  const performSync = async (user: UserResponse) => {
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem(STORAGE_KEYS.currentUser, jsonValue);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error performing sync', error);
    }
  };

  const loadStorageData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.currentUser);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading storage data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    // from React 19, AuthContext is enough, no need to AuthContext.Provider
    <AuthContext
      value={{ isLoading, currentUser, performLogin, performLogout, performSync }}
    >
      {children}
    </AuthContext>
  );
}
