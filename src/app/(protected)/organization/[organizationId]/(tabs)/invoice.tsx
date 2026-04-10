import { COLORS } from '@/constants/style-constant';
import { useFetch } from 'fetchwire';
import { Suspense, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import dayjs from 'dayjs';
import { FontAwesome5 } from '@expo/vector-icons';
import { getInvoicesByOrganizationIdApi } from '@/apis/invoice-apis';
import { InvoiceCard } from '@/components/cards/invoice-card';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import { Select } from '@/components/primitives/select';
import { InvoiceStatusOptions } from '@/constants/invoice-constants';
import { useLocalSearchParams } from 'expo-router';
import { useInvoiceTypeContext } from '@/providers/invoice-type-provider';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { EntityListSectionSkeleton } from '@/components/skeletons/entity-list-section-skeleton';

interface InvoiceListSectionProps {
  organizationId: string;
  selectedDate: dayjs.Dayjs;
  statusFilter: string;
  invoiceTypeCode: string;
}

function InvoiceListSection({
  organizationId,
  selectedDate,
  statusFilter,
  invoiceTypeCode,
}: InvoiceListSectionProps) {
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

  const fetchKey = `org-invoice-list-${organizationId}-${invoiceTypeCode}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  const { data: invoices, refreshFetch, isRefreshing } = useFetch(fetchInvoicesFn, fetchKey, {
    tags: ['organization-invoice-list'],
  });

  const normalizedInvoices = invoices ?? [];

  return (
    <FlatList
      data={normalizedInvoices}
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

export default function OrganizationInvoiceScreen() {
  const params = useLocalSearchParams<{
    organizationId: string;
    invoiceTypeCode: string;
  }>();

  const { organizationId } = params;
  const invoiceTypeCode = params.invoiceTypeCode || 'BUY';

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [statusFilter, setStatusFilter] = useState('');

  const suspenseResetKey = `org-invoice-list-${organizationId}-${invoiceTypeCode}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

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
            renderTrigger={(option) => (
              <>
                <VinaupVerticalExpandArrow width={18} height={18} />
                <Text style={{ color: COLORS.vinaupTeal }}>
                  {option.label || 'Trạng thái'}
                </Text>
              </>
            )}
            options={InvoiceStatusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            placeholder="Trạng thái"
            style={{
              triggerText: {
                fontSize: 16,
                color: COLORS.vinaupTeal,
              },
            }}
          />
        </View>
      </View>
      <Suspense fallback={<EntityListSectionSkeleton />}>
        <InvoiceListSection
          key={suspenseResetKey}
          organizationId={organizationId}
          selectedDate={selectedDate}
          statusFilter={statusFilter}
          invoiceTypeCode={invoiceTypeCode}
        />
      </Suspense>
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
