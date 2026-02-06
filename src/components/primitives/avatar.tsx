import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';

interface AvatarProps {
  imgSrc?: string | null;
  size?: number;
  icon?: React.ReactNode;
  style?: {
    container?: StyleProp<ViewStyle>;
  };
}

export function Avatar({ imgSrc, size = 32, icon, style }: AvatarProps) {
  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius },
        style?.container,
      ]}
    >
      {imgSrc ? (
        <Image
          source={{ uri: imgSrc }}
          style={{
            width: size - 4,
            height: size - 4,
            borderRadius: borderRadius - 2,
          }}
          resizeMode="cover"
        />
      ) : icon ? (
        icon
      ) : (
        <Octicons name="person" size={size * 0.6} color={COLORS.vinaupTeal} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.vinaupSoftGray,
  },
});
