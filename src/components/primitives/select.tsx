import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface SelectOption {
  label: string | null;
  value: string | null;
  leftSection?: React.ReactNode;
}

interface SelectProps {
  enableAnimation?: boolean;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  heightPercentage?: number;
  renderTrigger?: React.ReactNode;
}

export function Select({
  enableAnimation = true,
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  disabled = false,
  heightPercentage = 0.8,
  renderTrigger,
}: SelectProps) {
  const [visible, setVisible] = useState(false);
  const { height: screenHeight } = useWindowDimensions();
  const MODAL_HEIGHT = screenHeight * heightPercentage;
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;

  const handleOpen = () => {
    setVisible(true);
    if (!enableAnimation) {
      translateY.setValue(0);
      return;
    }
    translateY.setValue(MODAL_HEIGHT);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = (callback?: () => void) => {
    if (!enableAnimation) {
      callback?.();
      setVisible(false);
      return;
    }

    Animated.timing(translateY, {
      toValue: MODAL_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback?.();
      setVisible(false);
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
      <Pressable
        style={[styles.trigger, disabled && styles.disabled]}
        onPress={() => !disabled && handleOpen()}
      >
        {renderTrigger ? (
          renderTrigger
        ) : (
          <>
            <Text style={styles.triggerText} numberOfLines={1}>
              {selectedLabel}
            </Text>
            <FontAwesome6 name="caret-down" size={20} color={COLORS.vinaupTeal} />
          </>
        )}
      </Pressable>

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
    paddingHorizontal: 4,
    paddingVertical: 6,
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
