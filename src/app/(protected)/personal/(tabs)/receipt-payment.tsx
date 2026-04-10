import { getReceiptPaymentsByCurrentUserApi } from '@/apis/receipt-payment-apis';
import { ReceiptPaymentCard } from '@/components/cards/receipt-payment-card';
import { EntityListSectionSkeleton } from '@/components/skeletons/entity-list-section-skeleton';
import { COLORS } from '@/constants/style-constant';
import React, { Suspense, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import dayjs from 'dayjs';
import { FontAwesome5 } from '@expo/vector-icons';
import { ReceiptPaymentsSummary } from '@/components/summaries/receipt-payments-summary';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useFetch } from 'fetchwire';

interface ReceiptPaymentListSectionProps {
  selectedDate: dayjs.Dayjs;
}

function ReceiptPaymentListSection({
  selectedDate,
}: ReceiptPaymentListSectionProps) {
  const router = useRouter();

  const fetchReceiptPaymentsFn = async () => {
    return getReceiptPaymentsByCurrentUserApi({
      startDate: selectedDate.startOf('day').toISOString(),
      endDate: selectedDate.endOf('day').toISOString(),
    });
  };
  const fetchKey = `personal-receipt-payment-list-${selectedDate.format('YYYY-MM-DD')}`;

  const {
    data: receiptPayments,
    refreshFetch,
    isRefreshing,
  } = useFetch(fetchReceiptPaymentsFn, fetchKey, {
    tags: ['personal-receipt-payment-list'],
  });

  const normalizedReceiptPayments = receiptPayments ?? [];

  const navigateToFormScreen = (id?: string) => {
    router.push({
      pathname: '/(protected)/receipt-payment-form/[receiptPaymentId]',
      params: {
        receiptPaymentId: id || 'new',
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType: 'PAYMENT',
      },
    });
  };

  const renderItem = ({ item }: ListRenderItemInfo<ReceiptPaymentResponse>) => (
    <Pressable onPress={() => navigateToFormScreen(item.id)}>
      <ReceiptPaymentCard receiptPayment={item} />
    </Pressable>
  );

  return (
    <View style={styles.flex1}>
      <FlatList
        data={normalizedReceiptPayments}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFetch}
            colors={[COLORS.vinaupTeal]}
          />
        }
      />
      <ReceiptPaymentsSummary receiptPayments={normalizedReceiptPayments} />
    </View>
  );
}

export default function PersonalReceiptPaymentScreen() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const suspenseResetKey = selectedDate.format('YYYY-MM-DD');

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
          style={{ dateText: styles.dateText }}
        />
      </View>
      <Suspense fallback={<EntityListSectionSkeleton />}>
        <ReceiptPaymentListSection
          key={suspenseResetKey}
          selectedDate={selectedDate}
        />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  flex1: {
    flex: 1,
  },
});
