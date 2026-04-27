import { ReceiptPaymentCard } from '@/components/commons/cards/receipt-payment-card';
import { ReceiptPaymentSectionListHeader } from '@/components/commons/headers/receipt-payment-section-list-header';
import Loader from '@/components/primitives/loader';
import { COLORS } from '@/constants/style-constant';
import { useRouter } from 'expo-router';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { generateDayJsDateRange } from '@/utils/generator-helpers';
import dayjs from 'dayjs';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface ReceiptPaymentTourSettlementListContentProps {
  receiptPayments: ReceiptPaymentResponse[];
  startDate?: string;
  endDate?: string;
  loading?: boolean;
  tourSettlementId: string;
  organizationId?: string;
  isRefreshing: boolean;
}

export function ReceiptPaymentTourSettlementListContent({
  receiptPayments,
  startDate,
  endDate,
  loading,
  tourSettlementId,
  organizationId,
  isRefreshing,
}: ReceiptPaymentTourSettlementListContentProps) {
  const router = useRouter();
  const dateRange =
    startDate && endDate ? generateDayJsDateRange(startDate, endDate) : [];

  const dateKeysInRange = new Set(dateRange.map((d) => d.format('YYYY-MM-DD')));
  const { receiptPaymentsInRange, receiptPaymentsOutOfRange } =
    receiptPayments.reduce(
      (acc, rp) => {
        const key = dayjs(rp.transactionDate).format('YYYY-MM-DD');
        if (dateKeysInRange.has(key)) {
          acc.receiptPaymentsInRange.push(rp);
        } else {
          acc.receiptPaymentsOutOfRange.push(rp);
        }
        return acc;
      },
      {
        receiptPaymentsInRange: [] as ReceiptPaymentResponse[],
        receiptPaymentsOutOfRange: [] as ReceiptPaymentResponse[],
      }
    );

  const receiptPaymentsInRangeMap = receiptPaymentsInRange.reduce(
    (map, rp) => {
      const dateKey = dayjs(rp.transactionDate).format('YYYY-MM-DD');
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(rp);
      return map;
    },
    {} as Record<string, ReceiptPaymentResponse[]>
  );
  const receiptPaymentInRangeSections = dateRange.map((d) => {
    const key = d.format('YYYY-MM-DD');
    return {
      title: d.format('DD/MM'),
      dateKey: key,
      data: receiptPaymentsInRangeMap[key] || [],
    };
  });

  const navigateToFormScreen = ({
    receiptPaymentId,
    dateKey,
  }: {
    receiptPaymentId?: string;
    dateKey?: string;
  }) => {
    router.push({
      pathname: '/(protected)/receipt-payment-form/[receiptPaymentId]',
      params: {
        receiptPaymentId: receiptPaymentId || 'new',
        tourSettlementId,
        organizationId,
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        transactionDate: dateKey || undefined,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader size={48} />
      </View>
    );
  }

  const renderOutOfRangeReceiptPaymentsSection = () => {
    if (receiptPaymentsOutOfRange.length === 0) return null;
    return (
      <View style={styles.outOfRangeContainer}>
        <View style={styles.outOfRangeHeader}>
          <Text style={styles.outOfRangeHeaderText}>
            Thu chi bị sai ngày !!! (*Bạn sửa ngày hoặc xóa)
          </Text>
        </View>
        {receiptPaymentsOutOfRange.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => navigateToFormScreen({ receiptPaymentId: item.id })}
          >
            <ReceiptPaymentCard receiptPayment={item} />
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <SectionList
      ListHeaderComponent={
        isRefreshing ? (
          <View style={styles.refreshLoaderContainer}>
            <ActivityIndicator size="small" color={COLORS.vinaupTeal} />
          </View>
        ) : null
      }
      scrollEnabled={false}
      sections={receiptPaymentInRangeSections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          key={item.id}
          onPress={() => navigateToFormScreen({ receiptPaymentId: item.id })}
        >
          <ReceiptPaymentCard receiptPayment={item} />
        </Pressable>
      )}
      renderSectionHeader={({ section: { title, data, dateKey } }) => (
        <ReceiptPaymentSectionListHeader
          title={title}
          receiptPayments={data}
          onPressAddNew={() => navigateToFormScreen({ dateKey })}
        />
      )}
      renderSectionFooter={({ section }) =>
        section.data.length === 0 ? (
          <View style={styles.emptyGroup}>
            <Text style={styles.emptyGroupText}>Không có thu chi</Text>
          </View>
        ) : null
      }
      ListFooterComponent={renderOutOfRangeReceiptPaymentsSection}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  refreshLoaderContainer: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
  },
  emptyGroup: {
    paddingHorizontal: 10,
  },
  emptyGroupText: {
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
    fontStyle: 'italic',
  },
  outOfRangeContainer: {
    marginTop: 12,
  },
  outOfRangeHeader: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  outOfRangeHeaderText: {
    fontSize: 16,
    color: COLORS.vinaupRed,
    fontWeight: '600',
  },
});
