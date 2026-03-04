import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  StyleProp,
  TextStyle,
} from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface SelectOption {
  label: string | null;
  value: string | null;
  leftSection?: React.ReactNode;
}

interface SelectProps {
  isLoading?: boolean;
  enableAnimation?: boolean;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  heightPercentage?: number;
  renderTrigger?: React.ReactNode;
  style?: {
    triggerText?: StyleProp<TextStyle>;
  }
}

export function Select({
  enableAnimation = true,
  isLoading = false,
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  disabled = false,
  heightPercentage = 0.8,
  renderTrigger,
  style,
}: SelectProps) {
  const [visible, setVisible] = useState(false);
  const { height: screenHeight } = useWindowDimensions();
  const MODAL_HEIGHT = screenHeight * heightPercentage;
  const translateY = useSharedValue(MODAL_HEIGHT);
  const finalizeClose = (callback?: () => void) => {
    callback?.();
    setVisible(false);
  };
  const handleOpen = () => {
    setVisible(true);
    if (!enableAnimation) {
      translateY.value = 0;
      return;
    }
    translateY.value = MODAL_HEIGHT;
    translateY.value = withTiming(0, { duration: 350 });
  };

  const handleClose = (callback?: () => void) => {
    if (!enableAnimation) {
      finalizeClose(callback);
      return;
    }

    translateY.value = withTiming(MODAL_HEIGHT, { duration: 200 }, (finished) => {
      if (finished) {
        scheduleOnRN(finalizeClose, callback);
      }
    });
  };

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label || placeholder;

  const handleSelect = (val: string) => {
    handleClose(() => {
      onChange(val);
    });
  };

  return (
    <>
      {isLoading ? (
        <View style={[styles.trigger]}>
          <ActivityIndicator size="small" color={COLORS.vinaupTeal} />
        </View>
      ) : (
        <Pressable
          style={[styles.trigger, disabled && styles.disabled]}
          onPress={() => !disabled && handleOpen()}
        >
          {renderTrigger ? (
            renderTrigger
          ) : (
            <>
              <Text style={[styles.triggerText, style?.triggerText]} numberOfLines={1}>
                {selectedLabel}
              </Text>
              <FontAwesome6 name="caret-down" size={20} color={COLORS.vinaupTeal} />
            </>
          )}
        </Pressable>
      )}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => handleClose()}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => handleClose()} />

          <Animated.View
            style={[
              styles.sheetContent,
              {
                height: MODAL_HEIGHT,
                transform: [{ translateY: translateY }],
              },
            ]}
          >
            <View style={styles.header}>
              {/* <View style={styles.handle} /> */}
              <Text style={styles.headerTitle}>{placeholder}</Text>
            </View>

            <ScrollView bounces={false} contentContainerStyle={styles.listPadding}>
              {options.map((item) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    key={item.value}
                    style={[styles.optionItem, isSelected && styles.optionSelected]}
                    onPress={() => handleSelect(item.value || '')}
                  >
                    <View style={styles.optionLeftContent}>
                      {item.leftSection}
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={COLORS.vinaupTeal}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
            <SafeAreaView edges={['bottom']} />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  triggerText: {
    color: COLORS.vinaupTeal,
    fontSize: 18,
    fontWeight: '400',
  },
  disabled: { opacity: 0.5 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  listPadding: {
    paddingBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionSelected: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 18,
    color: '#444',
  },
  optionTextActive: {
    color: COLORS.vinaupTeal,
    fontWeight: '600',
  },
});
