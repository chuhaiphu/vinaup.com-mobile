import React from 'react';
import { usePathname, Route } from 'expo-router';
import { Select } from '@/components/primitives/select';
import { COLORS } from '@/constants/style-constant';
import VinaupPlusMinus from '@/components/icons/vinaup-plus-minus.native';
import VinaupHome from '@/components/icons/vinaup-home.native';
import VinaupCalendarIcon from '@/components/icons/vinaup-calendar-icon';
import VinaupPlusMinusMultiplyEqual from '@/components/icons/vinaup-plus-minus-multiply-equal.native';
import VinaupSelector from '@/components/icons/vinaup-selector.native';
import { useSafeRouter } from '@/hooks/use-safe-router';

export default function NavigatorSelector() {
  const safeRouter = useSafeRouter();
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
    safeRouter.safeNavigate(path as Route);
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
