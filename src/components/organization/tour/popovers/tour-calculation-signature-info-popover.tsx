// src/components/tour-calculation-popover.tsx
import React from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/style-constant';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Popover } from '@/components/primitives/popover';

export interface TourCalculationSignatureInfoPopoverRef {
  open: () => void;
  close: () => void;
}

interface TourCalculationSignatureInfoPopoverProps {
  isVisible: boolean;
  onClose: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TourCalculationSignatureInfoPopover({
  isVisible,
  onClose,
  containerStyle,
}: TourCalculationSignatureInfoPopoverProps) {
  const HeaderLeft = (
    <>
      <MaterialCommunityIcons
        name="lightbulb-on"
        size={24}
        color={COLORS.vinaupTeal}
      />
      <Text style={styles.tipText}>Chữ ký được huỷ</Text>
    </>
  );

  const CloseIcon = <Ionicons name="close" size={24} color={COLORS.vinaupOrange} />;

  return (
    <Popover
      isVisible={isVisible}
      onClose={onClose}
      headerLeft={HeaderLeft}
      closeIcon={CloseIcon}
      style={{
        container: [{ backgroundColor: COLORS.vinaupSoftYellow }, containerStyle],
        closeButton: { position: 'absolute', top: 10, right: 10, padding: 0 },
      }}
    >
      <View style={styles.textBlock}>
        <View style={styles.topTextBlock}>
          <Text style={styles.textContent}>
            Ký tên là được{' '}
            <Text style={{ color: COLORS.vinaupBlueLink }}>&quot;Huỷ ký&quot;</Text>
          </Text>
          <Text style={[styles.textContent, { fontStyle: 'italic' }]}>
            Có nhật ký hủy để đối chiếu nội dung
          </Text>
        </View>
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
    flexDirection: 'column',
    gap: 6,
    marginBottom: 8,
  },
  textContent: {
    fontSize: 16,
    color: COLORS.vinaupDarkGray,
  },
});
