// src/components/tour-calculation-popover.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '@/constants/style-constant';

import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Popover } from '@/components/primitives/popover';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';

interface TourCalculationTicketSummaryPopoverProps {
  onPenClick?: () => void;
}

export function TourCalculationTicketSummaryPopover({
  onPenClick,
}: TourCalculationTicketSummaryPopoverProps) {
  const [isVisible, setIsVisible] = useState(true);
  const HeaderLeft = (
    <>
      <MaterialCommunityIcons
        name="lightbulb-on"
        size={24}
        color={COLORS.vinaupTeal}
      />
      <Text style={styles.tipText}>Tip</Text>
    </>
  );

  const CloseIcon = <Ionicons name="close" size={24} color={COLORS.vinaupOrange} />;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlePenClick = () => {
    if (onPenClick) {
      onPenClick();
    }
    setIsVisible(false);
  };

  return (
    <Popover
      isVisible={isVisible}
      position={{ top: 75, left: 8, right: 8 }}
      onClose={handleClose}
      headerLeft={HeaderLeft}
      closeIcon={CloseIcon}
      style={{
        container: [{ backgroundColor: COLORS.vinaupSoftYellow }],
        closeButton: { position: 'absolute', top: 10, right: 10, padding: 0 },
      }}
    >
      <View style={styles.textBlock}>
        <View style={styles.topTextBlock}>
          <Text style={styles.textContent}>Bấm vào</Text>
          <PressableOpacity onPress={handlePenClick}>
            <AntDesign name="edit" size={24} color={COLORS.vinaupTeal} />
          </PressableOpacity>
          <Text style={styles.textContent}>để nhập giá bán & số lượng</Text>
        </View>
        <Text style={styles.textContent}>
          Nhập thu chi bên dưới sẽ hiện ra số tiền ở đây
        </Text>
      </View>
    </Popover>
  );
}

const styles = StyleSheet.create({
  tipText: {
    fontSize: 18,
    color: COLORS.vinaupDarkGray,
  },
  textBlock: {},
  topTextBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  textContent: {
    fontSize: 16,
    color: COLORS.vinaupDarkGray,
  },
});
