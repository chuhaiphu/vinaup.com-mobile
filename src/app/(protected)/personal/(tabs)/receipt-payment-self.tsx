import { getReceiptPaymentsByCurrentUserApi } from '@/apis/receipt-payment-apis';
import Loader from '@/components/primitives/loader';
import { ReceiptPaymentCard } from '@/components/cards/receipt-payment-card';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeRouter } from '@/hooks/use-safe-router';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import dayjs from 'dayjs';
import { FontAwesome5 } from '@expo/vector-icons';

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

  const navigateToFormScreen = async (id?: string) => {
    if (safeRouter.isNavigating) return;
    safeRouter.safePush({
      pathname: '/(protected)/personal/receipt-payment/[id]/receipt-payment-form',
      params: {
        id: id || 'new',
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType: 'PAYMENT',
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateTimePickerContainer}>
        <DateTimePicker
          leftSection={
            <FontAwesome5 name="calendar-alt" size={18} color={COLORS.vinaupTeal} />
          }
          value={selectedDate}
          onChange={setSelectedDate}
          displayFormat="DD/MM"
          style={{
            dateText: styles.dateText,
          }}
        />
      </View>
      {!isLoading && (
        <FlatList
          data={receiptPayments}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigateToFormScreen(item.id)}>
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
      )}

      {isLoading && <Loader size={64} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  left: {
    fontSize: 18,
  },
  right: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
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
    color: COLORS.vinaupTeal,
  },
  separator: {
    height: 10,
  },
});
