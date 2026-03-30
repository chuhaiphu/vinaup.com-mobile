import { useRouter } from 'expo-router';
import { useAuthContext } from '@/providers/auth-provider';
import { Text, View, Button, StyleSheet } from 'react-native';

export default function PersonalProfileScreen() {
  const { performLogout } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    performLogout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Profile</Text>
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
