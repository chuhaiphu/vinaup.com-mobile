import React from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Popover } from '@/components/primitives/popover';

interface BookingSignaturePopoverProps {
  isVisible: boolean;
  onClose: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export function BookingSignaturePopover({
  isVisible,
  onClose,
  containerStyle,
}: BookingSignaturePopoverProps) {
  const HeaderLeft = (
    <>
      <MaterialCommunityIcons
        name="lightbulb-on"
        size={24}
        color={COLORS.vinaupTeal}
      />
      <Text style={styles.tipText}>Thông tin chữ ký</Text>
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
        <Text style={styles.textContent}>(Placeholder)</Text>
      </View>
    </Popover>
  );
}

const styles = StyleSheet.create({
  tipText: {
    fontSize: 18,
    color: COLORS.vinaupDarkGray,
  },
  textBlock: {
    marginBottom: 8,
  },
  textContent: {
    fontSize: 16,
    color: COLORS.vinaupDarkGray,
  },
});
