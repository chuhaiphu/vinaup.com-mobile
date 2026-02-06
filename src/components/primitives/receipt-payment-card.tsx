import { StyleSheet, Text, View } from 'react-native';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { VinaupPenLine } from '../icons/vinaup-pen-line.native';
import { COLORS } from '@/constants/style-constant';

interface ReceiptPaymentCardProps {
  receiptPayment: ReceiptPaymentResponse;
}

export function ReceiptPaymentCard({ receiptPayment }: ReceiptPaymentCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{receiptPayment.description}</Text>
          </View>
          <View style={styles.action}>
            <VinaupPenLine width={20} height={20} />
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
            <Text style={styles.equalSign}>=</Text>
          </View>
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceText}>
              {receiptPayment.quantity * receiptPayment.unitPrice}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  content: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    gap: 4,
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
  descriptionContainer: {},
  descriptionText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  action: {},
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
  unitPriceText: {
    fontSize: 18,
  },
  totalPriceContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  totalPriceText: {
    fontSize: 18,
  },
  multiplySign: {
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
  },
  equalSign: {
    fontSize: 18,
  },
});
