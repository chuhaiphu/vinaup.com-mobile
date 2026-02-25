import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';

interface TextSwitcherProps {
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  textPair: [string, string];
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
  currentIndex,
  onToggle,
  style,
}: TextSwitcherProps) {
  return (
    <Pressable onPress={onToggle} style={[styles.container, style?.container]}>
      {leftSection && <View>{leftSection}</View>}
      <Text style={[styles.text, style?.text]}>{textPair[currentIndex]}</Text>
      {rightSection && <View>{rightSection}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
});
