import React from 'react';
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { PressableOpacity } from './pressable-opacity';

interface TextSwitcherProps {
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  textPair: [string, string];
  iconPair?: [React.ReactNode, React.ReactNode];
  iconPosition?: 'left' | 'right';
  currentIndex: number;
  onToggle: () => void;
  style?: {
    container?: StyleProp<ViewStyle>;
    text?: StyleProp<TextStyle>;
  };
}

export function TextSwitcher({
  leftSection,
  rightSection,
  textPair,
  iconPair,
  currentIndex,
  iconPosition = 'left',
  onToggle,
  style,
}: TextSwitcherProps) {
  const currentIcon = iconPair ? iconPair[currentIndex] : null;
  return (
    <PressableOpacity
      onPress={onToggle}
      style={[styles.container, style?.container]}
    >
      {leftSection && <View>{leftSection}</View>}
      {iconPosition === 'left' && <View>{currentIcon}</View>}
      <Text style={[styles.text, style?.text]}>{textPair[currentIndex]}</Text>
      {iconPosition === 'right' && <View>{currentIcon}</View>}
      {rightSection && <View>{rightSection}</View>}
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
});
