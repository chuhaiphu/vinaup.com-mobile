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
import { ReceiptPaymentSectionListHeader } from '../../headers/receipt-payment-section-list-header';
import { useFetch } from 'fetchwire';
import { getReceiptPaymentsByProjectIdApi } from '@/apis/receipt-payment-apis';

interface ReceiptPaymentProjectListContentProps {
  projectId: string;
  startDate: Date;
  endDate: Date;
  onRefresh?: () => void;
}

interface ReceiptPaymentsSection {
  title: string;
  dateKey: string;
  data: ReceiptPaymentResponse[];
}

export function ReceiptPaymentProjectListContent({
  projectId,
  startDate,
  endDate,
  onRefresh,
}: ReceiptPaymentProjectListContentProps) {
  const router = useRouter();

  const fetchKey = `receipt-payment-list-in-project-${projectId}`;
  const { data, refreshFetch, isRefreshing } = useFetch(
    () => getReceiptPaymentsByProjectIdApi(projectId),
    fetchKey,
    { tags: [`receipt-payment-list-in-project-${projectId}`] }
  );
  const receiptPayments = data ?? [];

  const dateRange = generateDayJsDateRange(startDate, endDate);

  const { receiptPaymentSections, outOfRangeReceiptPayments } = (() => {
    // To avoid O(n^2) complexity with array group by (for each receipt payment, find the corresponding section with O(n) search),
    // We can use map to group receipt payments by date with O(1) access
    // Initialize map with key is date string and value is the section object
    const receiptPaymentsByDateMap: Record<string, ReceiptPaymentsSection> = {};
    // Fill the map with date range
    dateRange.forEach((d) => {
      const key = d.format('YYYY-MM-DD');
      receiptPaymentsByDateMap[key] = {
        title: d.format('DD/MM'),
        dateKey: key,
        data: [],
      };
    });

    const outOfRangeReceiptPayments: ReceiptPaymentResponse[] = [];
    // Group receipt payments by date using map for O(1) access and avoid O(n) search with array
    receiptPayments.forEach((item) => {
      const key = dayjs(item.transactionDate).format('YYYY-MM-DD');
      if (receiptPaymentsByDateMap[key]) {
        receiptPaymentsByDateMap[key].data.push(item);
      } else {
        outOfRangeReceiptPayments.push(item);
      }
    });

    return {
      receiptPaymentSections: Object.values(receiptPaymentsByDateMap),
      outOfRangeReceiptPayments: outOfRangeReceiptPayments,
    };
  })();

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
        projectId,
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType: 'PAYMENT',
        transactionDate: dateKey || undefined,
      },
    });
  };

  const renderOutOfRangeReceiptPaymentsSection = () => {
    if (outOfRangeReceiptPayments.length === 0) return null;
    return (
      <View style={styles.outOfRangeContainer}>
        <View style={styles.outOfRangeHeader}>
          <Text style={styles.outOfRangeHeaderText}>
            Thu chi bị sai ngày !!! (*Bạn sửa ngày hoặc xóa)
          </Text>
        </View>
        {outOfRangeReceiptPayments.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => navigateToFormScreen({ receiptPaymentId: item.id })}
          >
            <ReceiptPaymentCard key={item.id} receiptPayment={item} />
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <SectionList
      sections={receiptPaymentSections}
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
        >
          <ReceiptPaymentCard key={item.id} receiptPayment={item} />
        </Pressable>
      )}
      renderSectionHeader={({ section: { title, data, dateKey } }) => (
        <ReceiptPaymentSectionListHeader
          title={title}
          receiptPayments={data}
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
