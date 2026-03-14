import { AuthProvider } from '@/providers/auth-provider';
import { InvoiceTypeProvider } from '@/providers/invoice-type-provider';
import { OrganizationProvider } from '@/providers/organization-provider';
import { OwnerModeProvider } from '@/providers/owner-mode-provider';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { initWire } from 'fetchwire';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/app-constant';

export default function RootLayout() {
  initWire({
    baseUrl: process.env.EXPO_PUBLIC_API_URL || '',
    headers: {
      'x-request-platform': 'mobile',
    },
    getToken: async () => {
      return await AsyncStorage.getItem(STORAGE_KEYS.accessToken);
    },
  });
  return (
    <AuthProvider>
      <OrganizationProvider>
        <InvoiceTypeProvider>
          <OwnerModeProvider>
            <StatusBar barStyle="dark-content" />
            <Stack screenOptions={{ headerShown: false }} />
          </OwnerModeProvider>
        </InvoiceTypeProvider>
      </OrganizationProvider>
    </AuthProvider>
  );
}
