import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';
import VinaupExpand from '@/components/icons/vinaup-expand.native';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';

interface ReceiptPaymentsSummaryProps {
  receiptPayments?: ReceiptPaymentResponse[] | null;
}

export function ReceiptPaymentsSummary({
  receiptPayments,
}: ReceiptPaymentsSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const summary = calculateReceiptPaymentsSummary(receiptPayments);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const rows = [
    {
      leftLabel: 'Bank in',
      leftValue: generateLocalePriceFormat(summary.bankIn),
      rightLabel: 'Hoa hồng',
      rightValue: '0',
    },
    {
      leftLabel: 'Bank out',
      leftValue: generateLocalePriceFormat(summary.bankOut),
      rightLabel: 'Tổng thu',
      rightValue: generateLocalePriceFormat(summary.totalReceipt),
    },
    {
      leftLabel: 'Cash in',
      leftValue: generateLocalePriceFormat(summary.cashIn),
      rightLabel: 'Tổng chi',
      rightValue: generateLocalePriceFormat(summary.totalPayment),
    },
    {
      leftLabel: 'Cash out',
      leftValue: generateLocalePriceFormat(summary.cashOut),
      rightLabel: 'Tổng dư',
      rightValue: generateLocalePriceFormat(summary.totalRemaining),
    },
  ];

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleExpand}>
        {isExpanded && (
          <View style={styles.expandedContent}>
            {rows.map((row, index) => (
              <View key={index} style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>{row.leftLabel}</Text>
                  <Text style={styles.value}>{row.leftValue}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>{row.rightLabel}</Text>
                  <Text style={styles.value}>{row.rightValue}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <VinaupExpand
              width={14}
              height={14}
              color={isExpanded ? 'gray' : COLORS.vinaupTeal}
            />
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.totalLabel}>Tổng dư: </Text>
            <Text style={styles.totalValue}>
              {generateLocalePriceFormat(summary.totalRemaining)}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  expandedContent: {
    backgroundColor: COLORS.vinaupWhite,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.vinaupBlack,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.vinaupLightGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.vinaupDarkGray,
  },
  summaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.vinaupBlack,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
});
