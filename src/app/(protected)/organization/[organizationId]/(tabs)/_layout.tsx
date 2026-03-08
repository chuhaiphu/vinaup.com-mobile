import { HomeHeader } from '@/components/headers/home-header/home-header';
import VinaupHome from '@/components/icons/vinaup-home.native';
import VinaupPlusMinus from '@/components/icons/vinaup-plus-minus.native';
import { COLORS } from '@/constants/style-constant';
import { Octicons } from '@expo/vector-icons';
import { Tabs, useLocalSearchParams } from 'expo-router';

export default function OrganizationTabsLayout() {
  const params = useLocalSearchParams<{ organizationId: string }>();
  const { organizationId } = params;
  return (
    <Tabs
      screenOptions={{
        header: () => <HomeHeader />,
        tabBarStyle: {
          backgroundColor: COLORS.vinaupNavyDark,
        },
        tabBarActiveTintColor: COLORS.vinaupYellow,
        tabBarInactiveTintColor: COLORS.vinaupWhite,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          margin: 0,
          width: '100%',
          height: '100%',
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
        initialParams={{ organizationId }}
        name="organization-receipt-payment"
        options={{
          tabBarIcon: ({ color, size }) => (
            <VinaupPlusMinus width={size} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="organization-profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
