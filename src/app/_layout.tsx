import { AuthProvider } from '@/providers/auth-provider';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { initWire } from 'fetchwire';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/app-constant';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigationStore } from '@/hooks/use-navigation-store';
import Loader from '@/components/primitives/loader';

initWire({
  baseUrl: process.env.EXPO_PUBLIC_API_URL || '',
  headers: {
    'x-request-platform': 'mobile',
  },
  interceptors: {
    onRequest: async () =>
      await new Promise<void>((resolve) => setTimeout(resolve, 500)),
  },
  getToken: async () => {
    return await AsyncStorage.getItem(STORAGE_KEYS.accessToken);
  },
  transformResponse(res) {
    const rawResponse = res as {
      statusCode?: number;
      data: object;
      message?: string;
    };
    return {
      status: rawResponse.statusCode,
      data: rawResponse.data,
      message: rawResponse.message || '',
    };
  },
});
export default function RootLayout() {
  const { isNavigating } = useNavigationStore();

  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <StatusBar barStyle="dark-content" />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
      {isNavigating && <Loader withOverlay size={96} />}
    </GestureHandlerRootView>
  );
}
