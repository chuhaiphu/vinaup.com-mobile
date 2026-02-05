import { HomeHeader } from "@/components/headers/home-header";
import VinaupHome from "@/components/icons/vinaup-home.native";
import { COLORS } from "@/constants/style-constant";
import { Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function PersonalTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <HomeHeader />,
        tabBarStyle: {
          backgroundColor: COLORS.vinaupBlueDark,
        },
        tabBarActiveTintColor: COLORS.vinaupYellow,
        tabBarInactiveTintColor: COLORS.vinaupWhite,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          margin: 0,
          width: "100%",
          height: "100%",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <VinaupHome width={size} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="personal-profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

