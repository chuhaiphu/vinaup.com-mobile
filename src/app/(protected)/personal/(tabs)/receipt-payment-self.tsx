import { getReceiptPaymentsByCurrentUserApi } from '@/apis/receipt-payment-apis';
import Loader from '@/components/primitives/loader';
import { ReceiptPaymentCard } from '@/components/primitives/receipt-payment-card';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '@/components/primitives/button';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { useSafeRouter } from '@/hooks/use-safe-router';
import DateTimePicker from '@/components/primitives/date-time-picker';
import dayjs from 'dayjs';

export default function ReceiptPaymentSelf() {
  const safeRouter = useSafeRouter();

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const {
    data: receiptPayments,
    isLoading,
    executeFetchFn: fetchReceiptPayments,
    isRefreshing,
    refreshFetchFn,
  } = useFetchFn<ReceiptPaymentResponse[]>();

  useEffect(() => {
    fetchReceiptPayments(() =>
      getReceiptPaymentsByCurrentUserApi({
        date: selectedDate.toDate(),
      })
    );
  }, [fetchReceiptPayments, selectedDate]);

  // Navigate to receipt payment form
  const navigateToForm = async (id?: string) => {
    if (safeRouter.isNavigating) return;
    safeRouter.safePush({
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
      <View style={styles.innerHeader}>
        <Text style={styles.screenTitle}>Thu chi cá nhân</Text>
        <Button
          style={styles.createButtonContainer}
          onPress={() => navigateToForm()}
          isLoading={safeRouter.isNavigating}
        >
          <VinaupAddNew width={28} height={28} />
        </Button>
      </View>
      <View style={styles.dateTimePickerContainer}>
        <DateTimePicker
          value={selectedDate}
          onChange={setSelectedDate}
          displayFormat="DD/MM"
          style={{
            dateText: styles.dateText,
          }}
        />
      </View>
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
      {isLoading && <Loader size={64} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 20,
  },
  innerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 12,
    borderBottomColor: COLORS.vinaupLightGray,
    borderBottomWidth: 1,
  },
  createButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimePickerContainer: {
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
});
