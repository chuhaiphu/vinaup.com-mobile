import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePathname, Route, useRouter } from 'expo-router';
import { Select, SelectOption } from '@/components/primitives/select';
import { COLORS } from '@/constants/style-constant';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { Ionicons } from '@expo/vector-icons';

import VinaupPlusMinusMultiplyEqual from '@/components/icons/vinaup-plus-minus-multiply-equal.native';
import VinaupSelector from '@/components/icons/vinaup-selector.native';
import VinaupUtilityShape from '@/components/icons/vinaup-utility-shape.native';
import VinaupInfoCircle from '@/components/icons/vinaup-info-circle.native';

export default function PersonalNavigatorSelector() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: SelectOption[] = [
    {
      value: '/personal/project',
      label: 'Lịch tiền công',
      leftSection: (
        <VinaupPlusMinusMultiplyEqual
          width={26}
          height={26}
          color={COLORS.vinaupTeal}
        />
      ),
    },
    {
      value: '/personal/shared',
      label: 'Được share với bạn',
      leftSection: (
        <Ionicons name="share-social" size={26} color={COLORS.vinaupTeal} />
      ),
    },
  ];

  const handleNavigation = (path: string) => {
    router.navigate(path as Route);
  };

  const renderCustomHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <VinaupUtilityShape />
        <Text style={styles.headerTitle}>Tiện ích</Text>
      </View>
      <PressableOpacity>
        <Ionicons name="settings-outline" size={26} color={COLORS.vinaupTeal} />
      </PressableOpacity>
    </View>
  );

  const renderCustomFooter = () => (
    <View style={styles.additionalInfo}>
      {/* Cột trái: Chỉ chứa Icon vừa đủ không gian */}
      <View style={styles.footerLeftColumn}>
        <VinaupInfoCircle width={28} height={28} />
      </View>

      {/* Cột phải: Chiếm phần không gian còn lại */}
      <View style={styles.footerRightColumn}>
        {/* Top Header */}
        <Text style={styles.topHeaderText}>Thông tin VinaUp</Text>

        {/* Bottom Header: Chứa 2 text trên 1 hàng có vạch ngăn cách */}
        <View style={styles.bottomHeader}>
          <Text style={styles.bottomHeaderText}>Giới thiệu</Text>
          <View style={styles.verticalDivider} />
          <Text style={styles.bottomHeaderText}>Hướng dẫn sử dụng</Text>
        </View>
      </View>
    </View>
  );

  const renderCustomOption = (
    option: SelectOption,
    isSelected: boolean,
    onSelect: () => void
  ) => {
    return (
      <PressableOpacity
        style={[styles.optionCard, isSelected && styles.optionCardSelected]}
        onPress={onSelect}
      >
        <View style={styles.optionContent}>
          {option.leftSection}
          <Text
            style={[styles.optionText, isSelected && styles.optionTextSelected]}
          >
            {option.label}
          </Text>
        </View>
      </PressableOpacity>
    );
  };

  return (
    <>
      <Select
        heightPercentage={0.6}
        renderTrigger={() => <VinaupSelector width={28} height={28} />}
        options={navItems}
        value={pathname}
        onChange={handleNavigation}
        renderHeader={renderCustomHeader}
        renderOption={renderCustomOption}
        renderFooter={renderCustomFooter}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 24,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.vinaupTeal,
  },
  optionCard: {
    backgroundColor: COLORS.vinaupSoftGray,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginHorizontal: 8,
    marginBottom: 4,
  },
  optionCardSelected: {
    backgroundColor: '#E8F2F2',
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  optionTextSelected: {
    fontWeight: '500',
  },
  additionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: COLORS.vinaupSoftYellow,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  footerLeftColumn: {
    alignSelf: 'flex-start',
  },
  footerRightColumn: {
    flex: 1,
    gap: 4,
  },
  topHeaderText: {
    fontSize: 18,
    color: COLORS.vinaupMediumDarkGray,
  },
  bottomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomHeaderText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.vinaupMediumDarkGray,
    opacity: 0.4,
  },
});
