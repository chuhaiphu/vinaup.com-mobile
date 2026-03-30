import React from 'react';
import { usePathname, Route, useRouter } from 'expo-router';
import { Select } from '@/components/primitives/select';
import { COLORS } from '@/constants/style-constant';
import VinaupPlusMinus from '@/components/icons/vinaup-plus-minus.native';
import VinaupHome from '@/components/icons/vinaup-home.native';
import VinaupCalendarIcon from '@/components/icons/vinaup-calendar-icon';
import VinaupPlusMinusMultiplyEqual from '@/components/icons/vinaup-plus-minus-multiply-equal.native';
import VinaupSelector from '@/components/icons/vinaup-selector.native';

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
      value: '/personal/receipt-payment',
      label: 'Thu chi ngày',
      leftSection: (
        <VinaupPlusMinus width={24} height={24} color={COLORS.vinaupYellow} />
      ),
    },
    {
      value: '/personal/project-self',
      label: 'Thu chi Tiền công',
      leftSection: (
        <VinaupCalendarIcon width={24} height={24} color={COLORS.vinaupYellow} />
      ),
    },
    {
      value: '/personal/project-company',
      label: 'Thu chi Dự án',
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
    router.navigate(path as Route);
  };

  return (
    <Select
      heightPercentage={0.9}
      renderTrigger={() => <VinaupSelector width={28} height={28} />}
      options={navItems}
      value={pathname}
      onChange={handleNavigation}
      placeholder="Điều hướng"
    />
  );
}
