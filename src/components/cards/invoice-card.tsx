import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import dayjs from 'dayjs';
import { InvoiceStatusDisplay } from '@/constants/invoice-constants';
import { useFetchFn } from 'fetchwire';
import { useEffect, useState } from 'react';
import { getReceiptPaymentsByInvoiceIdApi } from '@/apis/receipt-payment-apis';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { useRouter } from 'expo-router';
import { PressableOpacity } from '../primitives/pressable-opacity';

interface InvoiceCardProps {
  invoice?: InvoiceResponse;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const router = useRouter();

  const [isShowingPrice, setIsShowingPrice] = useState(false);
  const fetchReceiptPaymentsFn = () =>
    getReceiptPaymentsByInvoiceIdApi(invoice?.id || '');

  const { data: receiptPayments, executeFetchFn: fetchReceiptPayments } =
    useFetchFn(fetchReceiptPaymentsFn, {
      tags: ['organization-receipt-payment-list-in-invoice'],
    });

  useEffect(() => {
    if (invoice?.id) {
      fetchReceiptPayments();
    }
  }, [invoice, fetchReceiptPayments]);

  const getDateRangeText = () => {
    if (!invoice) return '';
    if (
      dayjs(invoice.startDate).format('DD/MM') ===
      dayjs(invoice.endDate).format('DD/MM')
    ) {
      return dayjs(invoice.startDate).format('DD/MM');
    }
    return `${dayjs(invoice.startDate).format('DD/MM')} - ${dayjs(
      invoice.endDate
    ).format('DD/MM')}`;
  };

  const getInvoiceInfoText = () => {
    if (!invoice) return '';
    if (invoice.organizationCustomer) {
      return invoice.organizationCustomer.name || '';
    }
    return invoice.externalCustomerName || invoice.externalOrganizationName || '—';
  };

  const togglePrice = () => {
    setIsShowingPrice(!isShowingPrice);
  };

  const navigateToDetail = (invoiceId: string) => {
    router.push({
      pathname: '/(protected)/invoice-detail/[invoiceId]',
      params: { invoiceId, invoiceTypeCode: invoice?.invoiceType?.code },
    });
  };

  if (!invoice) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text>Không có dữ liệu</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerHeader}>
        <View style={styles.left}>
          <Text style={styles.dateRangeText}>{getDateRangeText()}</Text>
          <PressableOpacity onPress={togglePrice}>
            <Text
              style={[
                styles.equalSignText,
                isShowingPrice && styles.equalSignActive,
              ]}
            >
              =
            </Text>
          </PressableOpacity>
          {isShowingPrice && (
            <Text style={styles.invoiceTotalAmountText}>
              {generateLocalePriceFormat(
                calculateReceiptPaymentsSummary(receiptPayments || [])
                  .totalRemaining,
                'vi-VN'
              )}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          <Text style={styles.statusText}>
            {InvoiceStatusDisplay[invoice.status]}
          </Text>
        </View>
      </View>
      <Pressable onPress={() => navigateToDetail(invoice.id)}>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{invoice.description}</Text>
            </View>
            <Text style={styles.codeText}>No. {invoice.code.slice(0, 8)}</Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
              {getInvoiceInfoText()}
            </Text>
            {/* <Text style={styles.totalAmountText}>
              {generateLocalePriceFormat(
                calculateReceiptPaymentsSummary(receiptPayments || [])
                  .totalRemaining,
                'vi-VN'
              )}
            </Text> */}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  innerHeader: {
    marginVertical: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  left: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  right: {},
  dateRangeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
  },
  equalSignText: {
    fontSize: 20,
    lineHeight: 20,
    paddingHorizontal: 4,
    borderRadius: 4,
    color: COLORS.vinaupTeal,
    backgroundColor: COLORS.vinaupWhite,
    overflow: 'hidden',
  },
  equalSignActive: {
    backgroundColor: 'transparent',
  },
  invoiceTotalAmountText: {
    fontSize: 16,
    flexShrink: 0,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  codeText: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
    marginLeft: 8,
    flexShrink: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
  },
  totalAmountText: {
    fontSize: 16,
    flexShrink: 0,
    marginLeft: 8,
  },
});
