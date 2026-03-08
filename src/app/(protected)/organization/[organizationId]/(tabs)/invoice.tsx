import Loader from '@/components/primitives/loader';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeRouter } from '@/hooks/use-safe-router';
import dayjs from 'dayjs';
import { FontAwesome5 } from '@expo/vector-icons';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import {
  getInvoicesByOrganizationIdApi,
  getInvoiceTypesApi,
} from '@/apis/invoice-apis';
import { InvoiceCard } from '@/components/cards/invoice-card';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import { Select } from '@/components/primitives/select';
import { InvoiceStatusOptions } from '@/constants/invoice-constants';
import { useLocalSearchParams } from 'expo-router';
import { InvoiceTypeResponse } from '@/interfaces/invoice-type-interfaces';

export default function OrganizationInvoice() {
  const safeRouter = useSafeRouter();
  const params = useLocalSearchParams<{
    organizationId: string;
    invoiceTypeCode: string;
  }>();
  const { organizationId } = params;
  const invoiceTypeCode = params.invoiceTypeCode || 'BUY';

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [statusFilter, setStatusFilter] = useState('');

  const {
    data: invoiceTypes,
    executeFetchFn: fetchInvoiceTypes,
  } = useFetchFn<InvoiceTypeResponse[]>({
    tags: ['invoice-types'],
  });

  const {
    data: invoices,
    isLoading,
    executeFetchFn: fetchInvoices,
    isRefreshing,
    refreshFetchFn: refreshInvoices,
  } = useFetchFn<InvoiceResponse[]>({
    tags: ['organization-invoice-list'],
  });

  useEffect(() => {
    fetchInvoiceTypes(() => getInvoiceTypesApi());
  }, [fetchInvoiceTypes]);

  useEffect(() => {
    if (!organizationId || !invoiceTypes) return;
    const invoiceType = invoiceTypes.find((t) => t.code === invoiceTypeCode);
    if (!invoiceType) return;

    fetchInvoices(() =>
      getInvoicesByOrganizationIdApi(organizationId, {
        invoiceTypeId: invoiceType.id,
        status: statusFilter || undefined,
        month: selectedDate.month() + 1,
        year: selectedDate.year(),
      })
    );
  }, [fetchInvoices, selectedDate, organizationId, invoiceTypeCode, invoiceTypes, statusFilter]);

  const navigateToDetail = (invoiceId: string) => {
    if (safeRouter.isNavigating) return;
    safeRouter.safePush({
      pathname: '/(protected)/organization/invoice-detail/[invoiceId]',
      params: { invoiceId },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <MonthYearPicker
          leftSection={
            <FontAwesome5 name="calendar-alt" size={18} color={COLORS.vinaupTeal} />
          }
          value={selectedDate}
          onChange={setSelectedDate}
          displayFormat="MM/YYYY"
          style={{
            dateText: styles.dateText,
          }}
        />
        <View style={styles.statusFilter}>
          <Select
            options={InvoiceStatusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            placeholder="Trạng thái"
            style={{
              triggerText: {
                fontSize: 16,
                color: COLORS.vinaupBlack,
              },
            }}
          />
        </View>
      </View>
      {!isLoading && (
        <FlatList
          data={invoices}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigateToDetail(item.id)}>
              <InvoiceCard invoice={item} />
            </Pressable>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshInvoices}
              colors={[COLORS.vinaupTeal]}
            />
          }
        />
      )}
      {isLoading && <Loader size={64} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    marginVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  separator: {
    height: 2,
  },
});
