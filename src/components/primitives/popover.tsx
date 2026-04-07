// src/components/popover.tsx
import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { PressableOpacity } from './pressable-opacity';
// Import icon từ Expo
import { Ionicons } from '@expo/vector-icons';

interface PopoverProps {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;

  position?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;

  closeIcon?: React.ReactNode;
  style?: {
    container?: StyleProp<ViewStyle>;
    headerContainer?: StyleProp<ViewStyle>;
    content?: StyleProp<ViewStyle>;
    closeButton?: StyleProp<ViewStyle>;
  };
}

export function Popover({
  isVisible,
  onClose,
  children,
  position = { top: 200, left: 8, right: 8 },
  headerLeft,
  headerRight,
  closeIcon,
  style,
}: PopoverProps) {
  if (!isVisible) return null;

  const renderCloseIcon = () => {
    if (closeIcon) return closeIcon;
    return <Ionicons name="close" size={24} color={COLORS.vinaupTeal} />;
  };

  return (
    <View style={[styles.container, position, style?.container]}>
      <View style={[styles.headerContainer, style?.headerContainer]}>
        <View style={styles.headerRowLeft}>
          {headerLeft}
          {headerRight}
        </View>
        <PressableOpacity
          onPress={onClose}
          style={[styles.closeButton, style?.closeButton]}
        >
          {renderCloseIcon()}
        </PressableOpacity>
      </View>
      <View style={[styles.content, style?.content]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    zIndex: 1000,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeButton: {
    padding: 2,
  },
});
