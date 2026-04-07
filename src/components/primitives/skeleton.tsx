import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
  style?: ViewStyle;
  borderRadius?: number;
}

export function Skeleton({ style, borderRadius }: SkeletonProps) {
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };
  const translateX = useSharedValue(0);
  useEffect(() => {
    if (width === 0) return;
    translateX.value = -width;
    translateX.value = withRepeat(
      withTiming(width, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, [width, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View onLayout={onLayout} style={[styles.container, { borderRadius }, style]}>
      {width > 0 && (
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
          <LinearGradient
            style={{ width: '100%', height: '100%' }}
            colors={['#ebebeb', '#f0f0f0', '#fafafa', '#f0f0f0', '#ebebeb']}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ebebeb', // màu nền khi gradient chưa đến
    overflow: 'hidden', // ← quan trọng: clip gradient ra ngoài biên
  },
});
