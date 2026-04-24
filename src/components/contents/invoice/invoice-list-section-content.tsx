import { COLORS } from '@/constants/style-constant';
import { useFetch } from 'fetchwire';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import { getInvoicesByOrganizationIdApi } from '@/apis/invoice-apis';
import { InvoiceCard } from '@/components/cards/invoice-card';
import { useInvoiceTypeContext } from '@/providers/invoice-type-provider';

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

  const fetchInvoicesFn = () => {
    const invoiceType = getInvoiceTypeByCode(invoiceTypeCode);
    return getInvoicesByOrganizationIdApi(organizationId, {
      invoiceTypeId: invoiceType?.id,
      status: statusFilter || undefined,
      startDate: selectedDate.startOf('month').toISOString(),
      endDate: selectedDate.endOf('month').toISOString(),
    });
  };

  const fetchKey = `organization-invoice-list-${organizationId}-${invoiceTypeCode}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  const {
    data: invoices,
    refreshFetch,
    isRefreshing,
  } = useFetch(fetchInvoicesFn, {
    fetchKey,
    tags: ['organization-invoice-list'],
  });

  return (
    <FlatList
      data={invoices}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <InvoiceCard invoice={item} />}
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
