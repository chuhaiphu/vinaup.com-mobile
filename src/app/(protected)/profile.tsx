import { AuthContext } from "@/providers/auth-provider";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Text, View, Button, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const { currentUser, performLogout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    performLogout();
    router.replace("/login");
  };

  if (!currentUser) {
    router.replace("/login");
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button
        title="Đăng xuất"
        onPress={handleLogout}
        color="#ff4444"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
