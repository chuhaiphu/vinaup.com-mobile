import { AuthContext } from '@/providers/auth-provider';
import { useContext, useEffect } from 'react';
import { Redirect, SplashScreen, Stack } from 'expo-router';
import { COLORS } from '@/constants/style-constant';

SplashScreen.preventAutoHideAsync();

export default function ProtectedLayout() {
  const { isLoading, currentUser } = useContext(AuthContext);

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
    <Stack>
      <Stack.Screen name="personal/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="organization/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="receipt-payment-form"
        options={{
          title: 'Chi tiết Thu / Chi',
          headerStyle: { backgroundColor: COLORS.vinaupTeal },
          headerTintColor: '#fff',
          headerBackTitle: 'Quay lại',
        }}
      />
    </Stack>
  );
}
