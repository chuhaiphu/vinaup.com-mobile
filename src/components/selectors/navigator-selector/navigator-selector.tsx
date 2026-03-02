import React from 'react';
import { useRouter, usePathname, Route } from 'expo-router';
import { Select } from '@/components/primitives/select';
import { COLORS } from '@/constants/style-constant';
import { FontAwesome6 } from '@expo/vector-icons';
import VinaupPlusMinus from '@/components/icons/vinaup-plus-minus.native';
import VinaupHome from '@/components/icons/vinaup-home.native';
import VinaupCalendarIcon from '@/components/icons/vinaup-calendar-icon';

export default function NavigatorSelector() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      value: '/personal',
      label: 'Home',
      leftSection: (
        <VinaupHome width={24} height={24} color={COLORS.vinaupYellow} />
      ),
    },
    {
      value: '/personal/receipt-payment-self',
      label: 'Thu chi ngày',
      leftSection: (
        <VinaupPlusMinus width={24} height={24} color={COLORS.vinaupYellow} />
      ),
    },
    {
      value: '/personal/receipt-payment-project',
      label: 'Tiền công & Dự án',
      leftSection: <VinaupCalendarIcon />,
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path as Route);
  };

  return (
    <Select
      heightPercentage={0.9}
      renderTrigger={
        <FontAwesome6 name="list-check" size={24} color={COLORS.vinaupSoftYellow} />
      }
      options={navItems}
      value={pathname}
      onChange={handleNavigation}
      placeholder="Điều hướng"
    />
  );
}
