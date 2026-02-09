import { getReceiptPaymentsByCurrentUserApi } from '@/apis/receipt-payment-apis';
import Loader from '@/components/primitives/loader';
import { ReceiptPaymentCard } from '@/components/primitives/receipt-payment-card';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useEffect } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import VinaupAddNewIcon from '@/assets/images/vinaup-add-new-icon.png';
import { Button } from '@/components/primitives/button';

export default function ReceiptPaymentSelf() {
  const router = useRouter();

  const {
    data: receiptPayments,
    isLoading,
    executeFetchFn: fetchReceiptPayments,
    isRefreshing,
    refreshFetchFn,
  } = useFetchFn<ReceiptPaymentResponse[]>();

  useEffect(() => {
    fetchReceiptPayments(() => getReceiptPaymentsByCurrentUserApi());
  }, [fetchReceiptPayments]);

  // Navigate to receipt payment form
  const navigateToForm = (id?: string) => {
    router.push({
      pathname: '/(protected)/receipt-payment-form',
      params: {
        id: id,
        mode: id ? 'update' : 'create',
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType: 'PAYMENT',
      },
    });
  };

  return (
    <View style={styles.container}>
      {isLoading && <Loader size={64} />}
      <FlatList
        data={receiptPayments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigateToForm(item.id)}>
            <ReceiptPaymentCard receiptPayment={item} />
          </Pressable>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFetchFn}
            colors={[COLORS.vinaupTeal]}
          />
        }
      />
      <View style={styles.innerFooter}>
        <Button
          style={styles.createButtonContainer}
          onPress={() => navigateToForm()}
        >
          <Text style={styles.createButtonText}>Tạo mới</Text>
          <Image
            source={VinaupAddNewIcon}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createButtonText: {
    fontSize: 18,
  },
  innerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
  },
  createButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
