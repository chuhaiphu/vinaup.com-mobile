import { HomeHeader } from '@/components/commons/headers/home-header/home-header';
import VinaupCircleHorizontalHalfArrow from '@/components/icons/vinaup-circle-horizontal-half-arrow.native';
import VinaupHome from '@/components/icons/vinaup-home.native';
import VinaupPlusMinus from '@/components/icons/vinaup-plus-minus.native';
import VinaupPlusMinusMultiplyEqual from '@/components/icons/vinaup-plus-minus-multiply-equal.native';
import VinaupSigningPenWithFrame from '@/components/icons/vinaup-signing-pen-with-frame.native';
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
        name="invoice"
        options={{
          tabBarIcon: ({ color, size }) => (
            <VinaupPlusMinus width={size} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="project"
        initialParams={{ organizationId }}
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
        name="tour"
        initialParams={{ organizationId }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <VinaupCircleHorizontalHalfArrow
              width={size * 1.15}
              height={size * 1.15}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        initialParams={{ organizationId, type: 'FROM' }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <VinaupSigningPenWithFrame
              width={size * 1.15}
              height={size * 1.15}
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
