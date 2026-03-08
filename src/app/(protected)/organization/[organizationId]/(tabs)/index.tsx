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
import { useEffect, useState } from 'react';
import { getReceiptPaymentsByOrganizationIdApi } from '@/apis/receipt-payment-apis';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';
import { MultiSelect } from '@/components/primitives/multiple-select';
import { useOrganizationUtilitiesStore } from '@/hooks/use-organization-utility-store';
import { ORG_UTILITY_KEYS } from '@/constants/app-constant';
import { useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
import { DateTimePicker } from '@/components/primitives/date-time-picker';

const UTILITY_OPTIONS = [
  { label: 'Thu bán hàng', value: ORG_UTILITY_KEYS.receiptPaymentReceipt },
  { label: 'Chi mua hàng', value: ORG_UTILITY_KEYS.receiptPaymentPayment },
];

export default function OrganizationIndexScreen() {
  const { organizationId } = useLocalSearchParams<{ organizationId: string }>();
  const { getSelectedUtilities, setUtilities } = useOrganizationUtilitiesStore();
  const selectedUtilities = getSelectedUtilities(organizationId);

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const {
    data: receiptPayments,
    executeFetchFn: fetchReceiptPayments,
    isRefreshing,
    refreshFetchFn: refreshReceiptPayments,
  } = useFetchFn<ReceiptPaymentResponse[]>({
    tags: ['organization-receipt-payment-list'],
  });

  useEffect(() => {
    if (!organizationId) return;
    fetchReceiptPayments(() =>
      getReceiptPaymentsByOrganizationIdApi(organizationId, {
        date: selectedDate.toDate(),
      })
    );
  }, [fetchReceiptPayments, organizationId, selectedDate]);

  const handlePress = (key: string) => {
    console.log('Pressed:', key);
  };

  const summary = calculateReceiptPaymentsSummary(receiptPayments);

  const allUtilities = [
    {
      key: ORG_UTILITY_KEYS.receiptPaymentReceipt,
      label: 'Thu bán hàng',
      value: summary.totalReceipt,
    },
    {
      key: ORG_UTILITY_KEYS.receiptPaymentPayment,
      label: 'Chi mua hàng',
      value: summary.totalPayment,
    },
  ];

  const visibleUtilities = allUtilities.filter((item) =>
    selectedUtilities.includes(item.key)
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshReceiptPayments}
          colors={[COLORS.vinaupTeal]}
          tintColor={COLORS.vinaupTeal}
        />
      }
    >
      <View style={styles.topRow}>
        <DateTimePicker
          leftSection={
            <FontAwesome5 name="calendar-alt" size={18} color={COLORS.vinaupTeal} />
          }
          value={selectedDate}
          onChange={setSelectedDate}
          displayFormat="DD/MM"
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

      <View style={styles.utilitiesRow}>
        <View style={styles.utilitiesLeft}>
          <VinaupUtilityIcon width={22} height={22} />
          <Text style={styles.utilitiesText}>Tiện ích</Text>
        </View>
        <MultiSelect
          options={UTILITY_OPTIONS}
          values={selectedUtilities}
          onChange={(vals) => setUtilities(organizationId, vals)}
          placeholder="Tiện ích"
          heightPercentage={0.3}
          renderTrigger={
            <Feather name="edit" size={24} color={COLORS.vinaupTeal} />
          }
        />
      </View>

      <View style={styles.card}>
        {visibleUtilities.map((item, index) => (
          <Pressable
            key={item.key}
            style={[
              styles.cardRow,
              index < visibleUtilities.length - 1 && styles.cardRowDivider,
            ]}
            onPress={() => handlePress(item.key)}
          >
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardValue}>{item.value}</Text>
          </Pressable>
        ))}
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
    marginTop: 8,
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
  card: {
    marginTop: 8,
    backgroundColor: COLORS.vinaupWhite,
    borderRadius: 14,
    paddingHorizontal: 8,
  },
  cardRow: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupLightGray,
  },
  cardLabel: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  cardValue: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
  },
});
