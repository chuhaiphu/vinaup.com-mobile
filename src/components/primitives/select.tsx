import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TextInput,
} from 'react-native';

import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SlideSheet, SlideSheetRef } from './slide-sheet';

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
  searchable?: boolean;
  style?: {
    triggerText?: StyleProp<TextStyle>;
  };
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
  searchable = false,
  style,
}: SelectProps) {
  const sheetRef = useRef<SlideSheetRef>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label || placeholder;

  const handleOpen = () => {
    sheetRef.current?.open();
  };

  const handleSelect = (val: string) => {
    sheetRef.current?.close(() => onChange(val));
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
              <Text
                style={[styles.triggerText, style?.triggerText]}
                numberOfLines={1}
              >
                {selectedLabel}
              </Text>
              <FontAwesome6 name="caret-down" size={20} color={COLORS.vinaupTeal} />
            </>
          )}
        </Pressable>
      )}
      <SlideSheet
        ref={sheetRef}
        onClose={() => setSearchQuery('')}
        enableAnimation={enableAnimation}
        heightPercentage={heightPercentage}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{placeholder}</Text>
        </View>
        {searchable && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.vinaupMediumGray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.vinaupMediumGray}
              autoFocus
            />
          </View>
        )}
        <ScrollView bounces={false} contentContainerStyle={styles.listPadding}>
          {filteredOptions.map((item) => {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
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
