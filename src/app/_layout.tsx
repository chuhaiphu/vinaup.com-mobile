import { AuthProvider } from '@/providers/auth-provider';
import { OrganizationProvider } from '@/providers/organization-provider';
import { OwnerModeProvider } from '@/providers/owner-mode-provider';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <OwnerModeProvider>
          <StatusBar barStyle="dark-content" />
          <Stack screenOptions={{ headerShown: false }} />
        </OwnerModeProvider>
      </OrganizationProvider>
    </AuthProvider>
  );
}
