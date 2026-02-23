import React from 'react';
import { useRouter, usePathname, Route } from 'expo-router';
import Select from '@/components/primitives/select';
import { COLORS } from '@/constants/style-constant';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import VinaupPlusMinus from '@/components/icons/vinaup-plus-minus.native';
import VinaupHome from '@/components/icons/vinaup-home.native';
import VinaupPlusMinusMultiplyEqual from '@/components/icons/vinaup-plus-minus-multiply-equal.native';

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
      label: 'Thu chi cá nhân',
      leftSection: (
        <VinaupPlusMinus width={24} height={24} color={COLORS.vinaupYellow} />
      ),
    },
    {
      value: '/personal/receipt-payment-project-self',
      label: 'Lịch tour & Tiền công',
      leftSection: (
        <FontAwesome5 name="calendar-alt" size={28} color={COLORS.vinaupYellow} />
      ),
    },
    {
      value: '/personal/receipt-payment-project-company',
      label: 'Thu chi dự án',
      leftSection: (
        <VinaupPlusMinusMultiplyEqual
          width={24}
          height={24}
          color={COLORS.vinaupYellow}
        />
      ),
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path as Route);
  };

  return (
    <Select
      heightPercentage={0.9}
      renderTrigger={
        <FontAwesome6 name="list-check" size={24} color={COLORS.vinaupTeal} />
      }
      options={navItems}
      value={pathname}
      onChange={handleNavigation}
      placeholder="Điều hướng"
    />
  );
}
