import VinaupHome from "@/components/icons/vinaup-home.native";
import { colors } from "@/constants/style-constant";
import { Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.vinaupBlueDark,
          paddingBottom: 0,
        },
        tabBarActiveTintColor: colors.vinaupYellow,
        tabBarInactiveTintColor: colors.vinaupWhite,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          margin: 0,
          width: '100%',
          height: '100%',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <VinaupHome width={size} height={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Octicons name="person" size={size} color={color} />
        }}
      />
    </Tabs>
  );
}