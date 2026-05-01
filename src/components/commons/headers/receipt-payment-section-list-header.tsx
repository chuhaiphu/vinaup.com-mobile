import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { generateLocalePriceFormat } from '@/utils/generator/string-generator/generate-locale-price-format';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator/calculate-receipt-payments-summary';

interface ReceiptPaymentSectionListHeaderProps {
  title: string;
  receiptPayments: ReceiptPaymentResponse[];
  onPressAddNew: () => void;
  canAdd?: boolean;
}

export function ReceiptPaymentSectionListHeader({
  title,
  receiptPayments,
  onPressAddNew,
  canAdd = true,
}: ReceiptPaymentSectionListHeaderProps) {
  const [isShowingPrice, setIsShowingPrice] = useState(false);
  const togglePrice = () => {
    setIsShowingPrice(!isShowingPrice);
  };
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.dateHeader}>
        <Text style={styles.dateHeaderText}>{title}</Text>
        <PressableOpacity onPress={togglePrice}>
          <Text
            style={[styles.equalSignText, isShowingPrice && styles.equalSignActive]}
          >
            =
          </Text>
        </PressableOpacity>
        {isShowingPrice && (
          <Text style={styles.projectTotalAmountText}>
            {generateLocalePriceFormat(
              calculateReceiptPaymentsSummary(receiptPayments || []).totalRemaining,
              'vi-VN'
            )}
          </Text>
        )}
      </View>
      {canAdd && (
        <Pressable onPress={onPressAddNew}>
          <VinaupAddNew width={24} height={24} iconColor={COLORS.vinaupWhite} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  equalSignText: {
    fontSize: 20,
    lineHeight: 20,
    paddingHorizontal: 4,
    borderRadius: 4,
    color: COLORS.vinaupTeal,
    backgroundColor: COLORS.vinaupWhite,
    overflow: 'hidden',
  },
  equalSignActive: {
    backgroundColor: 'transparent',
  },
  projectTotalAmountText: {
    fontSize: 16,
    flexShrink: 0,
  },
});
