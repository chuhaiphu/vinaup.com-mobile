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
import { getReceiptPaymentsByCurrentUserApi } from '@/apis/receipt-payment-apis';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { getProjectsOfCurrentUserApi } from '@/apis/project-apis';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';
import { MultiSelect } from '@/components/primitives/multiple-select';
import { usePersonalUtilitiesStore } from '@/hooks/use-personal-utility-store';
import {
  PERSONAL_UTILITY_KEYS,
  type PersonalUtilityKey,
} from '@/constants/app-constant';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import dayjs from 'dayjs';

const UTILITY_OPTIONS = [
  { label: 'Thu chi ngày', value: PERSONAL_UTILITY_KEYS.receiptPayment },
  {
    label: 'Thu chi Tiền công',
    value: PERSONAL_UTILITY_KEYS.projectSelf,
  },
  {
    label: 'Thu chi Dự án',
    value: PERSONAL_UTILITY_KEYS.projectCompany,
  },
];

export default function PersonalIndexScreen() {
  const { selectedUtilities, setUtilities } = usePersonalUtilitiesStore();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const {
    data: receiptPaymentsSelf,
    executeFetchFn: fetchReceiptPaymentsSelf,
    isRefreshing: isRefreshingReceiptPaymentsSelf,
    refreshFetchFn: refreshReceiptPaymentsSelf,
  } = useFetchFn<ReceiptPaymentResponse[]>();

  const {
    data: projectsSelf,
    executeFetchFn: fetchProjectsSelf,
    isRefreshing: isRefreshingProjectsSelf,
    refreshFetchFn: refreshProjectsSelf,
  } = useFetchFn<ProjectResponse[]>();

  const {
    data: projectsCompany,
    executeFetchFn: fetchProjectsCompany,
    isRefreshing: isRefreshingProjectsCompany,
    refreshFetchFn: refreshProjectsCompany,
  } = useFetchFn<ProjectResponse[]>();

  useEffect(() => {
    fetchReceiptPaymentsSelf(() =>
      getReceiptPaymentsByCurrentUserApi({
        date: selectedDate.toDate(),
      })
    );
  }, [fetchReceiptPaymentsSelf, selectedDate]);

  useEffect(() => {
    fetchProjectsSelf(() =>
      getProjectsOfCurrentUserApi({
        type: 'SELF',
        date: selectedDate.toDate(),
      })
    );
  }, [fetchProjectsSelf, selectedDate]);

  useEffect(() => {
    fetchProjectsCompany(() =>
      getProjectsOfCurrentUserApi({
        type: 'COMPANY',
        date: selectedDate.toDate(),
      })
    );
  }, [fetchProjectsCompany, selectedDate]);

  const handlePress = (id: string) => {
    console.log('Pressed:', id);
  };
  const onRefresh = async () => {
    await Promise.all([
      refreshReceiptPaymentsSelf(),
      refreshProjectsSelf(),
      refreshProjectsCompany(),
    ]);
  };

  const isRefreshing =
    isRefreshingReceiptPaymentsSelf ||
    isRefreshingProjectsSelf ||
    isRefreshingProjectsCompany;

  const allUtilities = [
    {
      key: PERSONAL_UTILITY_KEYS.receiptPayment,
      label: 'Thu chi ngày',
      value: calculateReceiptPaymentsSummary(receiptPaymentsSelf).totalRemaining,
    },
    {
      key: PERSONAL_UTILITY_KEYS.projectSelf,
      label: 'Thu chi Tiền công',
      value: `(${projectsSelf?.length || 0})`,
    },
    {
      key: PERSONAL_UTILITY_KEYS.projectCompany,
      label: 'Thu chi Dự án',
      value: `(${projectsCompany?.length || 0})`,
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
          onRefresh={onRefresh}
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
          onChange={(vals) => setUtilities(vals as PersonalUtilityKey[])}
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
    fontSize: 18
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
