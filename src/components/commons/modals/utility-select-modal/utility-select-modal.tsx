import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MultiSelect, MultiSelectOption } from '@/components/primitives/multi-select';
import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';

interface UtilitySelectModalProps {
  options: MultiSelectOption[];
  values: string[];
  onChange: (value: string[]) => void;
  utilitySelectRef: React.RefObject<SlideSheetRef | null>;
}

export function UtilitySelectModal({
  options,
  values,
  onChange,
  utilitySelectRef,
}: UtilitySelectModalProps) {
  return (
    <>
      <SlideSheet ref={utilitySelectRef} enableAnimation={true} heightPercentage={0.3}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tiện ích</Text>
          <Text style={styles.headerSubtitle}>Nổi bật</Text>
        </View>

        <MultiSelect
          options={options}
          values={values}
          onChange={onChange}
        />

        <SafeAreaView edges={['bottom']} />
      </SlideSheet>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupTeal,
  },
  headerSubtitle: {
    fontSize: 14,
  },
});