import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import VinaupUtilityIcon from '@/components/icons/vinaup-utility-icon.native';
import VinaupCog from '@/components/icons/vinaup-cog.native';
import { useContext, useEffect, useState } from 'react';
import { getReceiptPaymentsByInvoiceIdsApi } from '@/apis/receipt-payment-apis';
import { useFetchFn } from 'fetchwire';
import { MultiSelect } from '@/components/primitives/multiple-select';
import { useOrganizationUtilitiesStore } from '@/hooks/use-organization-utility-store';
import { ORG_UTILITY_KEYS, type OrgUtilityKey } from '@/constants/app-constant';
import { useLocalSearchParams, useRouter } from 'expo-router';
import dayjs from 'dayjs';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import VinaupPlusMinus from '@/components/icons/vinaup-plus-minus.native';
import { OrganizationHomeIndexSummary } from '@/components/summaries/organization-home-index-summary';
import { getInvoicesByOrganizationIdApi } from '@/apis/invoice-apis';
import { InvoiceTypeContext } from '@/providers/invoice-type-provider';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';

export default function OrganizationIndexScreen() {
  const router = useRouter();
  const { organizationId } = useLocalSearchParams<{ organizationId: string }>();
  const { getSelectedUtilities, setUtilities } = useOrganizationUtilitiesStore();
  const selectedUtilities = getSelectedUtilities(organizationId);
  const { getInvoiceTypeByCode } = useContext(InvoiceTypeContext);

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const utilityOptions = [
    {
      label: 'Thu bán hàng',
      value: ORG_UTILITY_KEYS.receiptPaymentReceipt,
      leftSection: (
        <View style={styles.utilityOptionIcon}>
          <VinaupPlusMinus width={22} height={22} color={COLORS.vinaupTeal} />
        </View>
      ),
    },
    {
      label: 'Chi mua hàng',
      value: ORG_UTILITY_KEYS.receiptPaymentPayment,
      leftSection: (
        <View style={styles.utilityOptionIcon}>
          <VinaupPlusMinus width={22} height={22} color={COLORS.vinaupTeal} />
        </View>
      ),
    },
  ];

  const fetchInvoicesFn = () =>
    getInvoicesByOrganizationIdApi(organizationId, {
      invoiceTypeId: getInvoiceTypeByCode('SELL')?.id,
      month: selectedDate.month() + 1,
      year: selectedDate.year(),
    });

  const {
    data: invoices,
    executeFetchFn: fetchInvoices,
  } = useFetchFn(fetchInvoicesFn, {
    tags: ['organization-invoice-list'],
  });

  const fetchReceiptPaymentsByInvoiceIdsFn = () =>
    getReceiptPaymentsByInvoiceIdsApi(
      (invoices || []).map((i) => i.id)
    );

  const {
    data: receiptPayments,
    executeFetchFn: fetchReceiptPaymentsByInvoiceIds,
    isRefreshing,
    refreshFetchFn: refreshReceiptPaymentsByInvoiceIds,
  } = useFetchFn(fetchReceiptPaymentsByInvoiceIdsFn, {
    tags: ['organization-receipt-payment-list-in-invoice'],
  });

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices, selectedDate, organizationId, getInvoiceTypeByCode]);

  useEffect(() => {
    if (!organizationId) return;
    if (!invoices || invoices.length === 0) return;
    fetchReceiptPaymentsByInvoiceIds();
  }, [fetchReceiptPaymentsByInvoiceIds, organizationId, selectedDate, invoices]);

  const handlePress = (key: string) => {
    if (key === 'settings') return;
    if (organizationId) {
      router.push(`/(protected)/organization/${organizationId}/(tabs)/invoice`);
    }
  };

  const allUtilities = [
    {
      key: ORG_UTILITY_KEYS.receiptPaymentReceipt,
      label: 'Thu bán hàng',
      icon: <VinaupPlusMinus width={28} height={28} color={COLORS.vinaupTeal} />,
    },
    {
      key: ORG_UTILITY_KEYS.receiptPaymentPayment,
      label: 'Chi mua hàng',
      icon: <VinaupPlusMinus width={28} height={28} color={COLORS.vinaupTeal} />,
    },
  ];

  const visibleUtilities = allUtilities.filter((item) =>
    selectedUtilities.includes(item.key)
  );

  const getGridDisplayUtilities = () => {
    const gridDisplayItems = [...visibleUtilities];
    while (gridDisplayItems.length < 3) {
      gridDisplayItems.push(null as unknown as (typeof visibleUtilities)[0]);
    }
    return gridDisplayItems;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshReceiptPaymentsByInvoiceIds}
          colors={[COLORS.vinaupTeal]}
          tintColor={COLORS.vinaupTeal}
        />
      }
    >
      <View style={styles.topRow}>
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
        <Pressable
          style={styles.iconButton}
          onPress={() => handlePress('settings')}
        >
          <VinaupCog width={24} height={24} />
        </Pressable>
      </View>

      <OrganizationHomeIndexSummary receiptPayments={receiptPayments} />

      <View style={styles.utilitiesRow}>
        <View style={styles.utilitiesLeft}>
          <VinaupUtilityIcon width={18} height={18} />
          <Text style={styles.utilitiesText}>Tiện ích</Text>
        </View>
        <MultiSelect
          options={utilityOptions}
          values={selectedUtilities}
          onChange={(vals) => setUtilities(organizationId, vals as OrgUtilityKey[])}
          placeholder="Tiện ích"
          heightPercentage={0.3}
          renderTrigger={
            <Feather name="edit" size={20} color={COLORS.vinaupTeal} />
          }
        />
      </View>

      <View style={styles.gridContainer}>
        {getGridDisplayUtilities().map((item, index) => {
          if (!item) {
            return <View key={`placeholder-${index}`} style={styles.gridItem} />;
          }
          return (
            <PressableOpacity
              key={item.key}
              style={styles.gridItem}
              onPress={() => handlePress(item.key)}
            >
              <View style={styles.gridIconBox}>{item.icon}</View>
              <View style={styles.gridTextBox}>
                <Text
                  style={styles.gridText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.label}
                </Text>
              </View>
            </PressableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.vinaupSoftGray,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilitiesRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  utilitiesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  utilitiesText: {
    fontSize: 18,
  },
  utilityOptionIcon: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 24,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridIconBox: {
    marginBottom: 8,
  },
  gridTextBox: {
    backgroundColor: COLORS.vinaupLightGreen,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 52,
    height: 52,
  },
  gridText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.vinaupTeal,
  },
});
