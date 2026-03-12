import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  TextStyle,
} from 'react-native';

import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import VinaupDoubleCheck from '../icons/vinaup-double-check.native';
import { SlideSheet, SlideSheetRef } from './slide-sheet';
import { PressableOpacity } from './pressable-opacity';

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
  renderOption?: (
    item: MultiSelectOption,
    ctx: {
      index: number;
      isSelected: boolean;
      toggle: () => void;
    }
  ) => React.ReactNode;
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
  renderOption,
  style,
}: MultiSelectProps) {
  const sheetRef = useRef<SlideSheetRef | null>(null);

  const handleOpen = () => {
    sheetRef.current?.open();
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
        <PressableOpacity
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
        </PressableOpacity>
      )}

      <SlideSheet
        ref={sheetRef}
        enableAnimation={enableAnimation}
        heightPercentage={heightPercentage}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{placeholder}</Text>
          <Text style={styles.headerSubtitle}>Nổi bật</Text>
        </View>

        <ScrollView bounces={false} contentContainerStyle={styles.listPadding}>
          <View style={styles.card}>
            {options.map((item, index) => {
              const isSelected = values.includes(item.value);
              if (renderOption) {
                const option = renderOption(item, {
                  index,
                  isSelected,
                  toggle: () => handleToggle(item.value),
                });
                return <React.Fragment key={item.value}>{option}</React.Fragment>;
              }
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
      </SlideSheet>
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
