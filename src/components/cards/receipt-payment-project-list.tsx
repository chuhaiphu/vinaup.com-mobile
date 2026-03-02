import React from 'react';
import { RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { ReceiptPaymentCard } from '@/components/cards/receipt-payment-card';
import { generateDateRange } from '@/utils/generator-helpers';
import { COLORS } from '@/constants/style-constant';
import Loader from '@/components/primitives/loader';

interface ReceiptPaymentProjectListProps {
  receiptPayments: ReceiptPaymentResponse[];
  startDate: Date;
  endDate: Date;
  loading?: boolean;
  onRefresh: () => void;
}

interface ReceiptPaymentsSection {
  title: string;
  data: ReceiptPaymentResponse[];
}

export function ReceiptPaymentProjectList({
  receiptPayments,
  startDate,
  endDate,
  loading,
  onRefresh,
}: ReceiptPaymentProjectListProps) {
  const dateRange = generateDateRange(startDate, endDate);

  const { receiptPaymentSections, outOfRangeReceiptPayments } = (() => {
    // To avoid O(n^2) complexity with array group by (for each receipt payment, find the corresponding section with O(n) search),
    // We can use map to group receipt payments by date with O(1) access
    // Initialize map with key is date string and value is the section object
    const receiptPaymentsByDateMap: Record<string, ReceiptPaymentsSection> = {};
    // Fill the map with date range
    dateRange.forEach((d) => {
      receiptPaymentsByDateMap[d.format('YYYY-MM-DD')] = {
        title: d.format('DD/MM'),
        data: [],
      };
    });

    const outOfRangeItems: ReceiptPaymentResponse[] = [];
    // Group receipt payments by date using map for O(1) access and avoid O(n) search with array
    receiptPayments.forEach((item) => {
      const key = dayjs(item.transactionDate).format('YYYY-MM-DD');
      if (receiptPaymentsByDateMap[key]) {
        receiptPaymentsByDateMap[key].data.push(item);
      } else {
        outOfRangeItems.push(item);
      }
    });

    return {
      receiptPaymentSections: Object.values(receiptPaymentsByDateMap),
      outOfRangeReceiptPayments: outOfRangeItems,
    };
  })();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader size={48} />
      </View>
    );
  }

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
          <ReceiptPaymentCard key={item.id} receiptPayment={item} />
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
          refreshing={loading ?? false}
          onRefresh={onRefresh}
          // Tùy chỉnh màu sắc (iOS & Android)
          colors={[COLORS.vinaupTeal]}
          tintColor={COLORS.vinaupTeal}
        />
      }
      renderItem={({ item }) => <ReceiptPaymentCard receiptPayment={item} />}
      renderSectionHeader={({ section: { title, data } }) => (
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>{title}</Text>
          <Text style={styles.dateHeaderCount}>({data.length})</Text>
        </View>
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
  dateGroupContainer: {
    marginBottom: 4,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  dateHeaderCount: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
  },
  emptyGroup: {
    paddingHorizontal: 12,
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
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  outOfRangeHeaderText: {
    fontSize: 16,
    color: COLORS.vinaupRed,
    fontWeight: '600',
  },
});
