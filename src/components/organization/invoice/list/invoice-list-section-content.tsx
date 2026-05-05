import { COLORS } from '@/constants/style-constant';
import { useFetch } from 'fetchwire';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import { getInvoicesByOrganizationIdApi } from '@/apis/invoice/invoice';
import { getReceiptPaymentsByInvoiceIdsApi } from '@/apis/receipt-payment/receipt-payment';
import { InvoiceCard } from '@/components/organization/invoice/invoice-card';
import { useInvoiceTypeContext } from '@/providers/invoice-type-provider';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator/calculate-receipt-payments-summary';

export interface InvoiceListSectionContentProps {
  organizationId: string;
  selectedDate: dayjs.Dayjs;
  statusFilter: string;
  invoiceTypeCode: string;
}

export function InvoiceListSectionContent({
  organizationId,
  selectedDate,
  statusFilter,
  invoiceTypeCode,
}: InvoiceListSectionContentProps) {
  const { getInvoiceTypeByCode } = useInvoiceTypeContext();

  const fetchInvoicesAndReceiptPaymentsFn = async () => {
    const invoiceType = getInvoiceTypeByCode(invoiceTypeCode);
    const invoicesRes = await getInvoicesByOrganizationIdApi(organizationId, {
      invoiceTypeId: invoiceType?.id,
      status: statusFilter || undefined,
      startDate: selectedDate.startOf('month').toISOString(),
      endDate: selectedDate.endOf('month').toISOString(),
    });

    const invoices = invoicesRes.data ?? [];
    const invoiceIds = invoices.map((inv) => inv.id);

    let allReceiptPayments: ReceiptPaymentResponse[] = [];
    if (invoiceIds.length > 0) {
      const rpRes = await getReceiptPaymentsByInvoiceIdsApi(invoiceIds);
      allReceiptPayments = rpRes.data ?? [];
    }

    return { invoices, allReceiptPayments };
  };

  const fetchKey = `organization-invoice-list-${organizationId}-${invoiceTypeCode}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  const {
    data,
    refreshFetch,
    isRefreshing,
  } = useFetch<{ invoices: InvoiceResponse[]; allReceiptPayments: ReceiptPaymentResponse[] }>(
    fetchInvoicesAndReceiptPaymentsFn,
    {
      fetchKey,
      tags: ['organization-invoice-list'],
    }
  );

  const invoices = data?.invoices ?? [];
  const allReceiptPayments = data?.allReceiptPayments ?? [];

  return (
    <FlatList
      data={invoices}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const invoiceRPs = allReceiptPayments.filter((rp) => rp.invoiceId === item.id);
        const { totalRemaining } = calculateReceiptPaymentsSummary(invoiceRPs);
        return <InvoiceCard invoice={item} totalRemaining={totalRemaining} />;
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshFetch}
          colors={[COLORS.vinaupTeal]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 2,
  },
});
