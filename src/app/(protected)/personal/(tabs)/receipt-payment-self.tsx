import { getReceiptPaymentsByCurrentUserApi } from '@/apis/receipt-payment-apis';
import ReceiptPaymentModal from '@/components/modals/receipt-payment-modal';
import Loader from '@/components/primitives/loader';
import { ReceiptPaymentCard } from '@/components/primitives/receipt-payment-card';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { useReceiptPaymentModalStore } from '@/hooks/use-modal-store';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useEffect } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ReceiptPaymentSelf() {
  const {
    data: receiptPayments,
    isLoading,
    executeFetchFn,
    isRefreshing,
    refreshFetchFn,
  } = useFetchFn<ReceiptPaymentResponse[]>();
  const setCreateMode = useReceiptPaymentModalStore((s) => s.setCreateMode);
  console.log('receiptPayments', receiptPayments);

  useEffect(() => {
    executeFetchFn(() => getReceiptPaymentsByCurrentUserApi());
  }, [executeFetchFn]);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Pressable style={styles.createButton} onPress={setCreateMode}>
          <Text style={styles.createButtonText}>Tao Thu / Chi</Text>
        </Pressable>
      </View>
      {isLoading && <Loader size={64} />}
      <FlatList
        data={receiptPayments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ReceiptPaymentCard receiptPayment={item} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFetchFn}
            colors={[COLORS.vinaupTeal]}
          />
        }
      />
      <ReceiptPaymentModal
        receiptPaymentsData={receiptPayments || []}
        receiptPaymentType="RECEIPT"
        categoryOptionsData={[]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  createButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.vinaupTeal,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: COLORS.vinaupWhite,
    fontSize: 14,
    fontWeight: '600',
  },
});
