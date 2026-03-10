import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';

interface PressableCardProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  style?: {
    container?: StyleProp<ViewStyle>;
    card?: StyleProp<ViewStyle>;
  };
}

export function PressableCard({
  children,
  style,
  ...pressableProps
}: PressableCardProps) {
  return (
    <Pressable
      {...pressableProps}
      style={[styles.container, style?.container]}
    >
      <View style={[styles.card, style?.card]}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {},
  card: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: COLORS.vinaupLightGray,
  },
});
