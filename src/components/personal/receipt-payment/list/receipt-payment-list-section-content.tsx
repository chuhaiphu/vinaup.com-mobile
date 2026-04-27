import { getReceiptPaymentsByCurrentUserApi } from '@/apis/receipt-payment-apis';
import { ReceiptPaymentCard } from '@/components/commons/cards/receipt-payment-card';
import { COLORS } from '@/constants/style-constant';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import { ReceiptPaymentsSummary } from '@/components/commons/receipt-payments-summary';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useFetch } from 'fetchwire';

export interface ReceiptPaymentListSectionContentProps {
  selectedDate: dayjs.Dayjs;
}

export function ReceiptPaymentListSectionContent({
  selectedDate,
}: ReceiptPaymentListSectionContentProps) {
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
  } = useFetch(fetchReceiptPaymentsFn, {
    fetchKey,
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

const styles = StyleSheet.create({
  separator: {
    height: 2,
  },
  flex1: {
    flex: 1,
  },
});
