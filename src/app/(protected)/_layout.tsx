import { AuthContext } from "@/providers/auth-provider";
import { useContext } from "react";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return <Redirect href="/login" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}