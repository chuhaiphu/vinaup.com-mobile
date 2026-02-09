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
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  disabled = false,
}: SelectProps) {
  const [visible, setVisible] = useState(false);
  const { height: screenHeight } = useWindowDimensions();
  const MIN_SHEET_HEIGHT = screenHeight * 0.4;

  const sheetHeight = useRef(new Animated.Value(MIN_SHEET_HEIGHT)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Offset is the anchor point for movement
        // Value is the current changing height from the offset
        sheetHeight.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        // Pull up means negative dy
        // So we subtract dy to increase height
        sheetHeight.setValue(-gestureState.dy);
      },
      onPanResponderRelease: () => {
        sheetHeight.flattenOffset();
      },
    })
  ).current;

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  const handleSelect = (val: string) => {
    onChange(val);
    setVisible(false);
  };

  return (
    <>
      <Pressable
        style={[styles.trigger, disabled && styles.disabled]}
        onPress={() => !disabled && setVisible(true)}
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {selectedLabel}
        </Text>
        <FontAwesome name="caret-down" size={24} color={COLORS.vinaupTeal} />
      </Pressable>

      {/* Bottom Sheet */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)} />

          <Animated.View style={[styles.sheetContent, { height: sheetHeight }]}>
            <View {...panResponder.panHandlers}>
              <View style={styles.handle} />
              <View style={styles.header}>
                <Text style={styles.headerTitle}>{placeholder}</Text>
              </View>
            </View>
            <ScrollView bounces={false} contentContainerStyle={styles.listPadding}>
              {options.map((item) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    key={item.value}
                    style={[styles.optionItem, isSelected && styles.optionSelected]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
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
            <SafeAreaView />
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
    // backgroundColor: COLORS.vinaupTeal,
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
  },
  sheetContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '30%',
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    padding: 8,
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
