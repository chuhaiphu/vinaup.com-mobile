import React from 'react';
import { Pressable, ViewStyle, StyleProp, PressableProps } from 'react-native';

interface PressableOpacityProps extends PressableProps {
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
}

export function PressableOpacity({
  children,
  style,
  activeOpacity = 0.6,
  ...props
}: PressableOpacityProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [style, { opacity: pressed ? activeOpacity : 1 }]}
    >
      {children}
    </Pressable>
  );
}
