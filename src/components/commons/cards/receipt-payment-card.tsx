import { StyleSheet, Text, View } from 'react-native';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { COLORS } from '@/constants/style-constant';

interface ReceiptPaymentCardProps {
  receiptPayment?: ReceiptPaymentResponse;
}

export function ReceiptPaymentCard({ receiptPayment }: ReceiptPaymentCardProps) {
  if (!receiptPayment) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text>Không có dữ liệu</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.descriptionText}>{receiptPayment.description}</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.unitPriceContainer}>
            <Text style={styles.unitPriceText}>
              {receiptPayment.type === 'PAYMENT' ? '-' : '+'}{' '}
              {receiptPayment.unitPrice}
            </Text>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.multiplySign}>x</Text>
            <Text style={styles.quantityText}>{receiptPayment.quantity}</Text>
            <Text style={styles.multiplySign}>x</Text>
            <Text style={styles.quantityText}>{receiptPayment.frequency ?? 1}</Text>
            <Text style={styles.equalSign}>=</Text>
          </View>
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceText}>
              {receiptPayment.quantity *
                (receiptPayment.frequency ?? 1) *
                receiptPayment.unitPrice}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  content: {
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flex: 0.75,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unitPriceContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  totalPriceContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  descriptionText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  unitPriceText: {
    fontSize: 18,
    lineHeight: 24,
  },
  totalPriceText: {
    fontSize: 18,
    lineHeight: 24,
  },
  multiplySign: {
    fontSize: 18,
    lineHeight: 24,
  },
  quantityText: {
    fontSize: 18,
    lineHeight: 24,
  },
  equalSign: {
    fontSize: 18,
    lineHeight: 24,
  },
});
