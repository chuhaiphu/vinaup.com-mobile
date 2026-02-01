import { storageKeys } from "@/constants/app-constant";
import { UserResponse } from "@/interfaces/user-interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen } from "expo-router";
import { createContext, useEffect, useState } from "react";

interface AuthContextType {
  currentUser: UserResponse | null;
  performLogin: (user: UserResponse) => void;
  performLogout: () => void;
}

SplashScreen.preventAutoHideAsync();

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  performLogin: () => { },
  performLogout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [isReady, setIsReady] = useState(false);

  const performLogin = async (user: UserResponse) => {
    try {
      setCurrentUser(user);
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem(storageKeys.currentUser, jsonValue);
    } catch (error) {
      console.error("Error saving user", error);
    }
  };

  const performLogout = async () => {
    try {
      setCurrentUser(null);
      await AsyncStorage.removeItem(storageKeys.currentUser);
    } catch (error) {
      console.error("Error removing user", error);
    }
  };

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(storageKeys.currentUser);
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error loading user from storage", error);
      } finally {
        setIsReady(true);
      }
    };
    loadStorageData();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    // from React 19, AuthContext is enough, no need to AuthContext.Provider
    <AuthContext value={{ currentUser, performLogin, performLogout }}>
      {children}
    </AuthContext>
  );
}