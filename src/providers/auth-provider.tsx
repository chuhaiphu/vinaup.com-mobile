import { STORAGE_KEYS } from '@/constants/app-constant';
import { UserResponse } from '@/interfaces/user-interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

interface AuthContextType {
  isLoading: boolean;
  currentUser: UserResponse | null;
  performLogin: (user: UserResponse, accessToken: string) => Promise<void>;
  performLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  currentUser: null,
  performLogin: async () => {},
  performLogout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const performLogin = async (user: UserResponse, accessToken: string) => {
    setIsLoading(true);
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem(STORAGE_KEYS.currentUser, jsonValue);
      await AsyncStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
      // wait for storage to complete before updating state to avoid race conditions
      // in organization provider which depends on currentUser to fetch organizations using token
      setCurrentUser(user);
    } catch (error) {
      console.error('Error saving user', error);
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
    } catch (error) {
      console.error('Error removing user', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStorageData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.currentUser);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    // from React 19, AuthContext is enough, no need to AuthContext.Provider
    <AuthContext value={{ isLoading, currentUser, performLogin, performLogout }}>
      {children}
    </AuthContext>
  );
}
