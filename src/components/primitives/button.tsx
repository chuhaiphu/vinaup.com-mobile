import React from 'react';
import { Pressable, ActivityIndicator, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  isLoading?: boolean;
}

export function Button({ isLoading, children, disabled, ...props }: ButtonProps) {
  return (
    <Pressable {...props} disabled={isLoading || disabled}>
      {isLoading ? <ActivityIndicator color="white" /> : children}
    </Pressable>
  );
}
