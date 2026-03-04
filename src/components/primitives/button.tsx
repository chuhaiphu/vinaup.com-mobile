import { COLORS } from '@/constants/style-constant';
import React from 'react';
import { Pressable, ActivityIndicator, PressableProps, View } from 'react-native';

interface ButtonProps extends PressableProps {
  isLoading?: boolean;
  loaderStyle?: {
    color?: string;
    size?: 'small' | 'large' | number;
  };
}

export function Button({
  isLoading,
  children,
  disabled,
  loaderStyle,
  ...props
}: ButtonProps) {
  return (
    <Pressable {...props} disabled={isLoading || disabled}>
      {isLoading ? (
        <View>
          <ActivityIndicator
            size={loaderStyle?.size || 'small'}
            color={loaderStyle?.color || COLORS.vinaupTeal}
          />
        </View>
      ) : (
        children
      )}
    </Pressable>
  );
}
