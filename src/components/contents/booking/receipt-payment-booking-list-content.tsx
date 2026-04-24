import React from 'react';
import {
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import dayjs from 'dayjs';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { ReceiptPaymentCard } from '@/components/cards/receipt-payment-card';
import { generateDayJsDateRange } from '@/utils/generator-helpers';
import { COLORS } from '@/constants/style-constant';
import { useRouter } from 'expo-router';
import { ReceiptPaymentSectionListHeader } from '@/components/headers/receipt-payment-section-list-header';
import { useFetch } from 'fetchwire';
import { getReceiptPaymentsByBookingIdApi } from '@/apis/receipt-payment-apis';

interface ReceiptPaymentBookingListContentProps {
  startDate: string;
  endDate: string;
  onRefresh?: () => void;
  bookingId: string;
  organizationId?: string;
  canEdit?: boolean;
}

export function ReceiptPaymentBookingListContent({
  startDate,
  endDate,
  onRefresh,
  bookingId,
  organizationId,
  canEdit = true,
}: ReceiptPaymentBookingListContentProps) {
  const fetchKey = `receipt-payment-list-in-booking-${bookingId}`;
  const { data, refreshFetch, isRefreshing } = useFetch(
    () => getReceiptPaymentsByBookingIdApi(bookingId),
    { fetchKey, tags: [`organization-receipt-payment-list-in-booking-${bookingId}`] }
  );
  const receiptPayments = data ?? [];
  const router = useRouter();

  const dateRange = generateDayJsDateRange(startDate, endDate);

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
    if (!canEdit) return;
    router.push({
      pathname: '/(protected)/receipt-payment-form/[receiptPaymentId]',
      params: {
        receiptPaymentId: receiptPaymentId || 'new',
        bookingId,
        organizationId,
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType: 'PAYMENT',
        transactionDate: dateKey || undefined,
      },
    });
  };

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
      scrollEnabled={false}
      sections={receiptPaymentInRangeSections}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            refreshFetch();
            onRefresh?.();
          }}
          colors={[COLORS.vinaupTeal]}
          tintColor={COLORS.vinaupTeal}
        />
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.itemContainer}
          key={item.id}
          onPress={() => navigateToFormScreen({ receiptPaymentId: item.id })}
          disabled={!canEdit}
        >
          <ReceiptPaymentCard receiptPayment={item} />
        </Pressable>
      )}
      renderSectionHeader={({ section: { title, data, dateKey } }) => (
        <ReceiptPaymentSectionListHeader
          title={title}
          receiptPayments={data}
          canAdd={canEdit}
          onPressAddNew={() =>
            navigateToFormScreen({
              dateKey,
            })
          }
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
  itemContainer: {
    marginBottom: 2,
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
