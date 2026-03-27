import { useSafeRouter } from '@/hooks/use-safe-router';
import { useAuthContext } from '@/providers/auth-provider';
import { useOwnerModeContext } from '@/providers/owner-mode-provider';
import { Text, View, Button, StyleSheet } from 'react-native';

export default function OrganizationProfileScreen() {
  const { performLogout } = useAuthContext();
  const { setOwnerMode } = useOwnerModeContext();

  const safeRouter = useSafeRouter();

  const handleLogout = () => {
    performLogout();
    setOwnerMode('personal');
    safeRouter.safeReplace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organization Profile</Text>
      <Button title="Đăng xuất" onPress={handleLogout} color="#ff4444" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
