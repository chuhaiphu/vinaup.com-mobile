import { useAuthContext } from '@/providers/auth-provider';
import { AllOrganizationsProvider } from '@/providers/all-organizations-provider';
import { OrganizationProvider } from '@/providers/organization-provider';
import { OwnerModeProvider } from '@/providers/owner-mode-provider';
import { useEffect } from 'react';
import { Redirect, SplashScreen, Stack } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function ProtectedLayout() {
  const { isLoading, currentUser } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (!currentUser) {
    return <Redirect href="/login" />;
  }
  return (
    <AllOrganizationsProvider>
      <OrganizationProvider>
        <OwnerModeProvider>
          <Stack>
            <Stack.Screen name="personal/(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="organization/[organizationId]"
              options={{ headerShown: false }}
            />
          </Stack>
        </OwnerModeProvider>
      </OrganizationProvider>
    </AllOrganizationsProvider>
  );
}
