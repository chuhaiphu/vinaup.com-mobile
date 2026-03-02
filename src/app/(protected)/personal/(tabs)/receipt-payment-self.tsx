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
  Text,
  View,
} from 'react-native';
import { Button } from '@/components/primitives/button';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
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
      <View>
        <View style={styles.dateTimePickerContainer}>
          <DateTimePicker
            leftSection={
              <FontAwesome5
                name="calendar-alt"
                size={18}
                color={COLORS.vinaupTeal}
              />
            }
            value={selectedDate}
            onChange={setSelectedDate}
            displayFormat="DD/MM"
            style={{
              dateText: styles.dateText,
            }}
          />
        </View>
        <View style={styles.titleRow}>
          <View style={styles.screenTitleContainer}>
            <Text style={styles.left}>Thu chi </Text>
            <Text style={styles.right}>ngày</Text>
          </View>
          <Button
            style={styles.createButtonContainer}
            onPress={() => navigateToFormScreen()}
            isLoading={safeRouter.isNavigating}
          >
            <VinaupAddNew width={32} height={32} />
          </Button>
        </View>
      </View>
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
  screenTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: COLORS.vinaupLightGreen,
    borderRadius: 10,
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
