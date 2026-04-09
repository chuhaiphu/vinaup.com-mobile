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
import { useRouter } from 'expo-router';
import { useInvoiceTypeContext } from '@/providers/invoice-type-provider';
import { ReceiptPaymentSectionListHeader } from '@/components/headers/receipt-payment-section-list-header';
import { useFetch } from 'fetchwire';
import { getReceiptPaymentsByInvoiceIdApi } from '@/apis/receipt-payment-apis';

interface ReceiptPaymentInvoiceListContentProps {
  invoiceId: string;
  startDate: Date;
  endDate: Date;
  onRefresh?: () => void;
  organizationId?: string;
  invoiceTypeId?: string;
}

interface ReceiptPaymentsSection {
  title: string;
  dateKey: string;
  data: ReceiptPaymentResponse[];
}

export function ReceiptPaymentInvoiceListContent({
  invoiceId,
  startDate,
  endDate,
  onRefresh,
  organizationId,
  invoiceTypeId,
}: ReceiptPaymentInvoiceListContentProps) {
  const router = useRouter();
  const fetchKey = `receipt-payment-list-in-invoice-${invoiceId}`;
  const { data, refreshFetch, isRefreshing } = useFetch(
    () => getReceiptPaymentsByInvoiceIdApi(invoiceId),
    fetchKey,
    {
      tags: [`receipt-payment-list-in-invoice-${invoiceId}`],
    }
  );
  const receiptPayments = data ?? [];

  const dateRange = generateDateRange(startDate, endDate);
  const { getInvoiceTypeById } = useInvoiceTypeContext();
  const invoiceType = getInvoiceTypeById(invoiceTypeId || '');
  const { receiptPaymentSections, outOfRangeReceiptPayments } = (() => {
    const receiptPaymentsByDateMap: Record<string, ReceiptPaymentsSection> = {};
    dateRange.forEach((d) => {
      const key = d.format('YYYY-MM-DD');
      receiptPaymentsByDateMap[key] = {
        title: d.format('DD/MM'),
        dateKey: key,
        data: [],
      };
    });

    const outOfRangeItems: ReceiptPaymentResponse[] = [];
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

  const navigateToFormScreen = ({
    receiptPaymentId,
    dateKey,
  }: {
    receiptPaymentId?: string;
    dateKey?: string;
  }) => {
    const receiptPaymentType = invoiceType?.code === 'BUY' ? 'PAYMENT' : 'RECEIPT';
    router.push({
      pathname: '/(protected)/receipt-payment-form/[receiptPaymentId]',
      params: {
        receiptPaymentId: receiptPaymentId || 'new',
        invoiceId,
        organizationId,
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType,
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
            <ReceiptPaymentCard receiptPayment={item} />
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
  listContent: {
    paddingBottom: 24,
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
