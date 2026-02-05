import { AuthProvider } from "@/providers/auth-provider";
import { OrganizationProvider } from "@/providers/organization-provider";
import { OwnerModeProvider } from "@/providers/owner-mode-provider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <OwnerModeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </OwnerModeProvider>
      </OrganizationProvider>
    </AuthProvider>
  );
}
