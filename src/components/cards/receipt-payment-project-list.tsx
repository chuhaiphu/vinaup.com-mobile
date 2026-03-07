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
import { generateDateRange } from '@/utils/generator-helpers';
import { COLORS } from '@/constants/style-constant';
import Loader from '@/components/primitives/loader';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { useSafeRouter } from '@/hooks/use-safe-router';

interface ReceiptPaymentProjectListProps {
  receiptPayments: ReceiptPaymentResponse[];
  startDate: Date;
  endDate: Date;
  loading?: boolean;
  onRefresh: () => void;
  projectId: string;
}

interface ReceiptPaymentsSection {
  title: string;
  dateKey: string;
  data: ReceiptPaymentResponse[];
}

export function ReceiptPaymentProjectList({
  receiptPayments,
  startDate,
  endDate,
  loading,
  onRefresh,
  projectId,
}: ReceiptPaymentProjectListProps) {
  const safeRouter = useSafeRouter();

  const dateRange = generateDateRange(startDate, endDate);

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

  const navigateToFormScreen = async ({
    id,
    dateKey,
  }: {
    id?: string;
    dateKey?: string;
  }) => {
    if (safeRouter.isNavigating) return;
    safeRouter.safePush({
      pathname: '/(protected)/personal/receipt-payment/[id]/receipt-payment-form',
      params: {
        id: id || 'new',
        projectId,
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType: 'PAYMENT',
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
            onPress={() => navigateToFormScreen({ id: item.id })}
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
          refreshing={loading ?? false}
          onRefresh={onRefresh}
          colors={[COLORS.vinaupTeal]}
          tintColor={COLORS.vinaupTeal}
        />
      }
      renderItem={({ item }) => (
        <Pressable
          key={item.id}
          onPress={() => navigateToFormScreen({ id: item.id })}
        >
          <ReceiptPaymentCard key={item.id} receiptPayment={item} />
        </Pressable>
      )}
      renderSectionHeader={({ section: { title, data, dateKey } }) => (
        <View style={styles.sectionHeader}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>{title}</Text>
            <Text style={styles.receiptPaymentCount}>({data.length})</Text>
          </View>
          <Pressable
            onPress={() =>
              navigateToFormScreen({
                dateKey,
              })
            }
          >
            <VinaupAddNew width={24} height={24} iconColor={COLORS.vinaupWhite} />
          </Pressable>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 12,
    marginBottom: 4,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: '600',
  },
  receiptPaymentCount: {
    fontSize: 16,
    color: COLORS.vinaupMediumDarkGray,
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
