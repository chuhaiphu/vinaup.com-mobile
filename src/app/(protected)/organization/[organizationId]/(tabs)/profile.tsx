import { useSafeRouter } from '@/hooks/use-safe-router';
import { AuthContext } from '@/providers/auth-provider';
import { OwnerModeContext } from '@/providers/owner-mode-provider';
import { useContext } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

export default function OrganizationProfileScreen() {
  const { performLogout } = useContext(AuthContext);
  const { setOwnerMode } = useContext(OwnerModeContext);

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
