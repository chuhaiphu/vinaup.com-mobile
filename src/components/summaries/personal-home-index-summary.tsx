import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { Feather } from '@expo/vector-icons';
import VinaupPlusMinus from '../icons/vinaup-plus-minus.native';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { PressableOpacity } from '../primitives/pressable-opacity';
import { useRouter } from 'expo-router';

interface PersonalHomeIndexSummaryProps {
  receiptPayments?: ReceiptPaymentResponse[] | null;
}

export function PersonalHomeIndexSummary({
  receiptPayments,
}: PersonalHomeIndexSummaryProps) {
  const summary = calculateReceiptPaymentsSummary(receiptPayments);
  const router = useRouter();

  const handlePressFirstColumn = () => {
    router.push('/(protected)/personal/(tabs)/receipt-payment');
  };

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryMainRow}>
        <PressableOpacity
          style={[styles.summaryColumn, styles.firstColumn]}
          onPress={handlePressFirstColumn}
        >
          <Text style={[styles.columnLabel, styles.firstColumnLabel]}>
            Tiêu dùng
          </Text>
          <Text style={[styles.columnValue, styles.firstColumnValue]}>Cá nhân</Text>
        </PressableOpacity>

        <View style={styles.summaryColumn}>
          <Text style={styles.columnLabel}>Thu vào</Text>
          <Text style={styles.columnValue}>
            {generateLocalePriceFormat(summary.totalReceipt)}
          </Text>
        </View>

        <View style={styles.summaryColumn}>
          <Text style={styles.columnLabel}>Chi ra</Text>
          <Text style={styles.columnValue}>
            {generateLocalePriceFormat(summary.totalPayment)}
          </Text>
        </View>
      </View>

      <Pressable style={styles.summaryBanner} onPress={() => {}}>
        <View style={styles.summaryBannerLeft}>
          <VinaupPlusMinus width={20} height={20} color={COLORS.vinaupTeal} />
          <Text style={styles.summaryBannerText}>
            Xem thu chi tháng này của bạn
          </Text>
        </View>
        <Feather name="chevron-right" size={22} color={COLORS.vinaupTeal} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    marginTop: 8,
    backgroundColor: COLORS.vinaupWhite,
    borderRadius: 10,
    padding: 8,
  },
  summaryMainRow: {
    flexDirection: 'row',
  },
  summaryColumn: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 4,
    borderRadius: 4,
  },
  firstColumn: {
    backgroundColor: COLORS.vinaupLightYellow,
    flex: 0.8,
    marginRight: 8,
  },
  firstColumnLabel: {
    color: COLORS.vinaupTeal,
    borderBottomWidth: 0,
  },
  firstColumnValue: {
    color: COLORS.vinaupTeal,
  },
  columnLabel: {
    fontSize: 16,
    color: COLORS.vinaupMediumDarkGray,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupMediumGray,
  },
  columnValue: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
    textAlign: 'center',
  },
  summaryBanner: {
    marginTop: 12,
    backgroundColor: COLORS.vinaupLightYellow,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  summaryBannerText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
});
