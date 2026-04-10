import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { Skeleton } from '@/components/primitives/skeleton';

export function FormInputListSkeleton() {
  return (
    <ScrollView style={styles.modalBody} bounces={false}>
      <View style={styles.modalBodyContainer}>
        <View style={styles.dateAndCategoryRow}>
          <Skeleton style={styles.dateSkeleton} borderRadius={4} />
          <Skeleton style={styles.categorySkeleton} borderRadius={4} />
        </View>

        {Array.from({ length: 3 }).map((_, index) => (
          <View key={`input-item-skeleton-${index}`} style={styles.inputItem}>
            <View style={styles.inputWrapper}>
              <View style={styles.labelSection}>
                <Skeleton style={styles.labelSkeleton} borderRadius={4} />
              </View>
              <View style={styles.separator} />
              <View style={styles.valueSection}>
                <Skeleton style={styles.valueSkeleton} borderRadius={4} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
    backgroundColor: COLORS.vinaupLightWhite,
  },
  modalBodyContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  dateAndCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateSkeleton: {
    width: 108,
    height: 24,
  },
  categorySkeleton: {
    width: 160,
    height: 24,
  },
  inputItem: {
    width: '100%',
    marginVertical: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    overflow: 'hidden',
    minHeight: 50,
    paddingRight: 8,
  },
  labelSection: {
    width: 100,
    paddingLeft: 8,
  },
  labelSkeleton: {
    width: 72,
    height: 22,
  },
  separator: {
    width: 1.5,
    height: '70%',
    backgroundColor: COLORS.vinaupMediumDarkGray,
  },
  valueSection: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  valueSkeleton: {
    width: '65%',
    height: 22,
  },
});
