import { HomeHeader } from '@/components/headers/home-header/home-header';
import VinaupHome from '@/components/icons/vinaup-home.native';
import VinaupPlusMinus from '@/components/icons/vinaup-plus-minus.native';
import VinaupPlusMinusMultiplyEqual from '@/components/icons/vinaup-plus-minus-multiply-equal.native';
import { COLORS } from '@/constants/style-constant';
import { Octicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function PersonalTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <HomeHeader />,
        tabBarActiveTintColor: COLORS.vinaupYellow,
        tabBarInactiveTintColor: COLORS.vinaupTeal,
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
        name="receipt-payment"
        options={{
          tabBarIcon: ({ color, size }) => (
            <VinaupPlusMinus width={size} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="project"
        options={{
          tabBarIcon: ({ color, size }) => (
            <VinaupPlusMinusMultiplyEqual
              width={size}
              height={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
