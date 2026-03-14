import { getReceiptPaymentsByCurrentUserApi } from '@/apis/receipt-payment-apis';
import Loader from '@/components/primitives/loader';
import { ReceiptPaymentCard } from '@/components/cards/receipt-payment-card';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from 'fetchwire';
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
import { ReceiptPaymentsSummary } from '@/components/summaries/receipt-payments-summary';

export default function PersonalReceiptPaymentScreen() {
  const safeRouter = useSafeRouter();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const {
    data: receiptPayments,
    isLoading,
    executeFetchFn: fetchReceiptPayments,
    isRefreshing,
    refreshFetchFn,
  } = useFetchFn(
    () =>
      getReceiptPaymentsByCurrentUserApi({
        date: selectedDate.toDate(),
      }),
    {
      tags: ['personal-receipt-payment-list'],
    }
  );

  useEffect(() => {
    fetchReceiptPayments();
  }, [fetchReceiptPayments, selectedDate]);

  const navigateToFormScreen = async (id?: string) => {
    if (safeRouter.isNavigating) return;
    safeRouter.safePush({
      pathname: '/(protected)/receipt-payment-form/[receiptPaymentId]',
      params: {
        receiptPaymentId: id || 'new',
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

      {!isLoading && <ReceiptPaymentsSummary receiptPayments={receiptPayments} />}
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
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  separator: {
    height: 2,
  },
});
