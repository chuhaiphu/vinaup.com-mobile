import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import VinaupCog from '@/components/icons/vinaup-cog.native';
import { useEffect, useState } from 'react';
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
import { useInvoiceTypeContext } from '@/providers/invoice-type-provider';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import { VinaupLogoPrimary } from '@/components/icons/vinaup-logo-primary.native';
import VinaupSigningPenWithFrame from '@/components/icons/vinaup-signing-pen-with-frame.native';

export default function OrganizationIndexScreen() {
  const router = useRouter();
  const { organizationId } = useLocalSearchParams<{ organizationId: string }>();
  const { getSelectedUtilities, setUtilities } = useOrganizationUtilitiesStore();
  const selectedUtilities = getSelectedUtilities(organizationId);
  const { getInvoiceTypeByCode } = useInvoiceTypeContext();

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
    {
      label: 'Booking',
      value: ORG_UTILITY_KEYS.booking,
      leftSection: (
        <View style={styles.utilityOptionIcon}>
          <VinaupSigningPenWithFrame
            width={22}
            height={22}
            color={COLORS.vinaupTeal}
          />
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

  const { data: invoices, executeFetchFn: fetchInvoices } = useFetchFn(
    fetchInvoicesFn,
    {
      tags: ['organization-invoice-list'],
    }
  );

  const fetchReceiptPaymentsByInvoiceIdsFn = () =>
    getReceiptPaymentsByInvoiceIdsApi((invoices || []).map((i) => i.id));

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

  const handlePress = (key: OrgUtilityKey | 'settings') => {
    if (key === 'settings' || !organizationId) return;

    if (key === ORG_UTILITY_KEYS.booking) {
      router.push({
        pathname: '/(protected)/organization/[organizationId]/(tabs)/booking',
        params: { organizationId },
      });
      return;
    }

    router.push({
      pathname: '/(protected)/organization/[organizationId]/(tabs)/invoice',
      params: {
        organizationId,
        invoiceTypeCode:
          key === ORG_UTILITY_KEYS.receiptPaymentReceipt ? 'SELL' : 'BUY',
      },
    });
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
    {
      key: ORG_UTILITY_KEYS.booking,
      label: 'Booking',
      icon: (
        <VinaupSigningPenWithFrame
          width={28}
          height={28}
          color={COLORS.vinaupTeal}
        />
      ),
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
        <PressableOpacity
          style={styles.iconButton}
          onPress={() => handlePress('settings')}
        >
          <VinaupCog width={24} height={24} />
        </PressableOpacity>
      </View>

      <OrganizationHomeIndexSummary
        receiptPayments={receiptPayments}
        organizationId={organizationId}
      />

      <View style={styles.utilitiesRow}>
        <View style={styles.utilitiesLeft}>
          <VinaupLogoPrimary
            width={20}
            height={20}
            color={COLORS.vinaupMediumGray}
          />
          <Text style={styles.utilitiesText}>Nổi bật</Text>
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
    gap: 6,
  },
  utilitiesText: {
    fontSize: 16,
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
