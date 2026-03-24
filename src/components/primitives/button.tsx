import { COLORS } from '@/constants/style-constant';
import React from 'react';
import { ActivityIndicator, PressableProps, View } from 'react-native';
import { PressableOpacity } from './pressable-opacity';

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
    <PressableOpacity {...props} disabled={isLoading || disabled}>
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
    </PressableOpacity>
  );
}
