import { AuthContext } from "@/providers/auth-provider";
import { Redirect } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function HomeIndexScreen() {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return <Redirect href="/login" />;
  }
  return (
    <View>
      <Text>Home Index</Text>
    </View>
  );
}