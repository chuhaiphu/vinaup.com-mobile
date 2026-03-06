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

import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import VinaupDoubleCheck from '../icons/vinaup-double-check.native';

export interface MultiSelectOption {
  label: string;
  value: string;
  leftSection?: React.ReactNode;
}

interface MultiSelectProps {
  isLoading?: boolean;
  enableAnimation?: boolean;
  options: MultiSelectOption[];
  values: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  heightPercentage?: number;
  renderTrigger?: React.ReactNode;
  style?: {
    triggerText?: StyleProp<TextStyle>;
  };
}

export function MultiSelect({
  enableAnimation = true,
  isLoading = false,
  options,
  values,
  onChange,
  placeholder = 'Chọn...',
  disabled = false,
  heightPercentage = 0.8,
  renderTrigger,
  style,
}: MultiSelectProps) {
  const [visible, setVisible] = useState(false);
  const { height: screenHeight } = useWindowDimensions();
  const MODAL_HEIGHT = screenHeight * heightPercentage;
  const translateY = useSharedValue(MODAL_HEIGHT);

  const handleOpen = () => {
    setVisible(true);
    if (!enableAnimation) {
      translateY.value = 0;
      return;
    }
    translateY.value = MODAL_HEIGHT;
    translateY.value = withTiming(0, { duration: 350 });
  };

  const handleClose = () => {
    if (!enableAnimation) {
      setVisible(false);
      return;
    }

    translateY.value = withTiming(MODAL_HEIGHT, { duration: 200 }, (finished) => {
      if (finished) {
        scheduleOnRN(setVisible, false);
      }
    });
  };

  const handleToggle = (val: string) => {
    const isSelected = values.includes(val);
    if (isSelected) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  const selectedLabels = options
    .filter((opt) => values.includes(opt.value))
    .map((opt) => opt.label);

  const triggerLabel =
    selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder;

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
              <Text
                style={[styles.triggerText, style?.triggerText]}
                numberOfLines={1}
              >
                {triggerLabel}
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
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={handleClose} />

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
              <Text style={styles.headerTitle}>{placeholder}</Text>
              <Text style={styles.headerSubtitle}>Nổi bật</Text>
            </View>

            <ScrollView bounces={false} contentContainerStyle={styles.listPadding}>
              <View style={styles.card}>
                {options.map((item, index) => {
                  const isSelected = values.includes(item.value);
                  return (
                    <Pressable
                      key={item.value}
                      style={[
                        styles.optionItem,
                        index < options.length - 1 && styles.optionDivider,
                      ]}
                      onPress={() => handleToggle(item.value)}
                    >
                      <View style={styles.optionLeftContent}>
                        {item.leftSection}
                        <Text style={styles.optionText}>{item.label}</Text>
                      </View>
                      <View style={[styles.checkbox]}>
                        {isSelected && <VinaupDoubleCheck />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
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
    backgroundColor: COLORS.vinaupSoftGray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listPadding: {
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: COLORS.vinaupWhite,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupLightGray,
  },
  optionLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.vinaupLightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
