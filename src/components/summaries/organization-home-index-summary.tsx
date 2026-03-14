import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { Feather } from '@expo/vector-icons';
import VinaupPlusMinus from '../icons/vinaup-plus-minus.native';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';

interface OrganizationHomeIndexSummaryProps {
  receiptPayments?: ReceiptPaymentResponse[] | null;
}

export function OrganizationHomeIndexSummary({
  receiptPayments,
}: OrganizationHomeIndexSummaryProps) {
  const summary = calculateReceiptPaymentsSummary(receiptPayments);
  const cashNet = summary.cashIn - summary.cashOut;
  const bankNet = summary.bankIn - summary.bankOut;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeaderRow}>
        <View style={styles.summaryHeaderItem}>
          <View style={styles.underlineContainer}>
            <Text style={styles.summaryHeaderText}>Thu</Text>
          </View>
        </View>
        <View style={styles.summaryHeaderItem}>
          <View style={styles.underlineContainer}>
            <Text style={styles.summaryHeaderText}>Tiền mặt</Text>
          </View>
        </View>
        <View style={styles.summaryHeaderItem}>
          <View style={styles.underlineContainer}>
            <Text style={styles.summaryHeaderText}>Ngân hàng</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryValueRow}>
        <Text style={styles.summaryLeftValue}>Bán hàng</Text>
        <Text style={styles.summaryCenterValue}>
          {generateLocalePriceFormat(cashNet)}
        </Text>
        <Text style={styles.summaryRightValue}>
          {generateLocalePriceFormat(bankNet)}
        </Text>
      </View>

      <Pressable style={styles.summaryBanner} onPress={() => {}}>
        <View style={styles.summaryBannerLeft}>
          <View>
            <VinaupPlusMinus width={20} height={20} color={COLORS.vinaupTeal} />
          </View>
          <Text style={styles.summaryBannerText}>
            Xem doanh số tháng này của bạn
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
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryHeaderItem: {
    flexDirection: 'row',
    flex: 1,
  },
  summaryHeaderText: {
    fontSize: 18,
    color: COLORS.vinaupMediumDarkGray,
  },
  underlineContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.vinaupMediumGray,
  },
  summaryValueRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryLeftValue: {
    flex: 1,
    fontSize: 20,
    color: COLORS.vinaupBlack,
    textAlign: 'left',
  },
  summaryCenterValue: {
    flex: 1,
    fontSize: 20,
    color: COLORS.vinaupBlack,
  },
  summaryRightValue: {
    flex: 1,
    fontSize: 20,
    color: COLORS.vinaupBlack,
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
