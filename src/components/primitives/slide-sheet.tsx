import { useImperativeHandle, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { KeyboardSafeAvoidingView } from './keyboard-safe-avoiding-view';
import { scheduleOnRN } from 'react-native-worklets';

export interface SlideSheetRef {
  open: () => void;
  close: (onComplete?: () => void) => void;
}

interface SlideSheetProps {
  onClose?: () => void;
  onOpen?: () => void;
  enableAnimation?: boolean;
  heightPercentage?: number;
  children: React.ReactNode;
  ref?: React.RefObject<SlideSheetRef | null>;
}

export function SlideSheet({
  onClose,
  onOpen,
  enableAnimation = true,
  heightPercentage,
  children,
  ref,
}: SlideSheetProps) {
  const [modalVisible, setModalVisible] = useState(false);
  // Use this to reset the children component state on every open,
  // By unmounting them when the sheet is closed, and only mounting them when the sheet is open
  const [shouldMountChildren, setShouldMountChildren] = useState(false);
  const { height: screenHeight } = useWindowDimensions();
  const sheetHeight = heightPercentage
    ? screenHeight * heightPercentage
    : undefined;
  const animDistance = sheetHeight || screenHeight;
  const translateY = useSharedValue(animDistance);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = (onComplete?: () => void) => {
    if (!enableAnimation) {
      setModalVisible(false);
      onClose?.();
      onComplete?.();
      return;
    }
    translateY.value = withTiming(animDistance, { duration: 200 }, (finished) => {
      if (finished) {
        scheduleOnRN(setModalVisible, false);
        // keep the children mounted during the closing animation, only unmount them after the animation is complete
        scheduleOnRN(setShouldMountChildren, false);
        if (onClose) scheduleOnRN(onClose);
        if (onComplete) scheduleOnRN(onComplete);
      }
    });
  };

  const handleOpen = () => {
    setModalVisible(true);
    setShouldMountChildren(true);
    if (!enableAnimation) {
      translateY.value = 0;
      return;
    }
    translateY.value = animDistance;
    translateY.value = withTiming(0, { duration: 350 }, (finished) => {
      if (finished && onOpen) {
        scheduleOnRN(onOpen);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleClose,
  }));

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => handleClose()}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={() => handleClose()} />
        <KeyboardSafeAvoidingView>
          <Animated.View
            style={[
              styles.sheetContent,
              sheetHeight != null && { height: sheetHeight },
              animatedStyle,
            ]}
          >
            {shouldMountChildren ? children : null}
          </Animated.View>
        </KeyboardSafeAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    overflow: 'hidden',
  },
});
