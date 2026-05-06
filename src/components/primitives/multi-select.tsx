import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';

import { COLORS } from '@/constants/style-constant';
import VinaupDoubleCheck from '../icons/vinaup-double-check.native';
import { PressableOpacity } from './pressable-opacity';

export interface MultiSelectOption {
  label: string;
  value: string;
  leftSection?: React.ReactNode;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  values: string[];
  onChange: (value: string[]) => void;
  renderOption?: (
    item: MultiSelectOption,
    ctx: {
      index: number;
      isSelected: boolean;
      toggle: () => void;
    }
  ) => React.ReactNode;
  style?: {
    optionText?: StyleProp<TextStyle>;
  };
}

export function MultiSelect({
  options,
  values,
  onChange,
  renderOption,
  style,
}: MultiSelectProps) {
  const handleToggle = (val: string) => {
    const isSelected = values.includes(val);
    if (isSelected) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
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
            <PressableOpacity
              key={item.value}
              style={[
                styles.optionItem,
                index < options.length - 1 && styles.optionDivider,
              ]}
              onPress={() => handleToggle(item.value)}
            >
              <View style={styles.optionLeftContent}>
                {item.leftSection}
                <Text style={[styles.optionText, style?.optionText]}>
                  {item.label}
                </Text>
              </View>
              <View style={styles.checkbox}>
                {isSelected && <VinaupDoubleCheck />}
              </View>
            </PressableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listPadding: {
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: COLORS.vinaupWhite,
    borderRadius: 14,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupLightGray,
  },
  optionLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  optionText: {
    fontSize: 16,
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