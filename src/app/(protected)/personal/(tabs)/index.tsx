import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import VinaupCog from '@/components/icons/vinaup-cog.native';
import { useEffect, useState } from 'react';
import {
  getReceiptPaymentsByCurrentUserApi,
  getReceiptPaymentsByProjectIdsApi,
} from '@/apis/receipt-payment-apis';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useFetchFn } from 'fetchwire';
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
import VinaupCalendarIcon from '@/components/icons/vinaup-calendar-icon';
import VinaupPlusMinus from '@/components/icons/vinaup-plus-minus.native';
import VinaupPlusMinusMultiplyEqual from '@/components/icons/vinaup-plus-minus-multiply-equal.native';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { PersonalHomeIndexSummary } from '@/components/summaries/personal-home-index-summary';
import { VinaupLogoPrimary } from '@/components/icons/vinaup-logo-primary.native';
import { useRouter } from 'expo-router';
import { IndexUtilityGrid } from '@/components/grids/index-utility-grid';

export default function PersonalIndexScreen() {
  const router = useRouter();
  const { selectedUtilities, setUtilities } = usePersonalUtilitiesStore();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const utilityOptions = [
    {
      label: 'Thu chi ngày',
      value: PERSONAL_UTILITY_KEYS.receiptPayment,
      leftSection: (
        <View style={styles.utilityOptionIcon}>
          <VinaupPlusMinus width={22} height={22} color={COLORS.vinaupTeal} />
        </View>
      ),
    },
    {
      label: 'Thu chi Tiền công',
      value: PERSONAL_UTILITY_KEYS.projectSelf,
      leftSection: (
        <View style={styles.utilityOptionIcon}>
          <VinaupCalendarIcon width={22} height={22} color={COLORS.vinaupTeal} />
        </View>
      ),
    },
    {
      label: 'Thu chi Dự án',
      value: PERSONAL_UTILITY_KEYS.projectCompany,
      leftSection: (
        <View style={styles.utilityOptionIcon}>
          <VinaupPlusMinusMultiplyEqual
            width={22}
            height={22}
            color={COLORS.vinaupTeal}
          />
        </View>
      ),
    },
  ];

  const fetchReceiptPaymentsSelfFn = () =>
    getReceiptPaymentsByCurrentUserApi({
      startDate: selectedDate.startOf('day').toISOString(),
      endDate: selectedDate.endOf('day').toISOString(),
    });

  const {
    data: receiptPaymentsSelf,
    executeFetchFn: fetchReceiptPaymentsSelf,
    isRefreshing: isRefreshingReceiptPaymentsSelf,
    refreshFetchFn: refreshReceiptPaymentsSelf,
  } = useFetchFn(fetchReceiptPaymentsSelfFn, {
    fetchKey: `personal-receipt-payment-list-${selectedDate.format('YYYY-MM-DD')}`,
    tags: ['personal-receipt-payment-list'],
  });

  const fetchProjectsSelfFn = () =>
    getProjectsOfCurrentUserApi({
      type: 'SELF',
      startDate: selectedDate.startOf('day').toISOString(),
      endDate: selectedDate.endOf('day').toISOString(),
    });

  const {
    data: projectsSelf,
    executeFetchFn: fetchProjectsSelf,
    isRefreshing: isRefreshingProjectsSelf,
    refreshFetchFn: refreshProjectsSelf,
  } = useFetchFn(fetchProjectsSelfFn, {
    fetchKey: `personal-project-list-self-${selectedDate.format('YYYY-MM-DD')}`,
  });

  const fetchProjectsCompanyFn = () =>
    getProjectsOfCurrentUserApi({
      type: 'COMPANY',
      startDate: selectedDate.startOf('day').toISOString(),
      endDate: selectedDate.endOf('day').toISOString(),
    });

  const {
    data: projectsCompany,
    executeFetchFn: fetchProjectsCompany,
    isRefreshing: isRefreshingProjectsCompany,
    refreshFetchFn: refreshProjectsCompany,
  } = useFetchFn(fetchProjectsCompanyFn, {
    fetchKey: `personal-project-list-company-${selectedDate.format('YYYY-MM-DD')}`,
  });

  const [receiptPaymentsInProjectSelf, setReceiptPaymentsInProjectSelf] = useState<
    ReceiptPaymentResponse[] | null
  >(null);

  useEffect(() => {
    fetchReceiptPaymentsSelf();
  }, [fetchReceiptPaymentsSelf, selectedDate]);

  useEffect(() => {
    fetchProjectsSelf();
  }, [fetchProjectsSelf, selectedDate]);

  useEffect(() => {
    fetchProjectsCompany();
  }, [fetchProjectsCompany, selectedDate]);

  useEffect(() => {
    if (!projectsSelf) return;
    const ids = projectsSelf.map((p) => p.id);
    if (ids.length === 0) {
      setReceiptPaymentsInProjectSelf([]);
      return;
    }
    getReceiptPaymentsByProjectIdsApi(ids).then((res) => {
      setReceiptPaymentsInProjectSelf(res.data ?? null);
    });
  }, [projectsSelf]);

  const handlePress = (key: string) => {
    if (key === PERSONAL_UTILITY_KEYS.projectSelf) {
      router.push('/(protected)/personal/(tabs)/project-self');
      return;
    }
    if (key === PERSONAL_UTILITY_KEYS.projectCompany) {
      router.push('/(protected)/personal/(tabs)/project-company');
      return;
    }
    if (key === PERSONAL_UTILITY_KEYS.receiptPayment) {
      router.push('/(protected)/personal/(tabs)/receipt-payment');
    }
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
      icon: <VinaupPlusMinus width={26} height={26} color={COLORS.vinaupTeal} />,
    },
    {
      key: PERSONAL_UTILITY_KEYS.projectSelf,
      label: 'Thu chi Tiền công',
      value: `(${projectsSelf?.length || 0})`,
      icon: <VinaupCalendarIcon width={26} height={26} color={COLORS.vinaupTeal} />,
    },
    {
      key: PERSONAL_UTILITY_KEYS.projectCompany,
      label: 'Thu chi Dự án',
      value: `(${projectsCompany?.length || 0})`,
      icon: (
        <VinaupPlusMinusMultiplyEqual
          width={26}
          height={26}
          color={COLORS.vinaupTeal}
        />
      ),
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
        <PressableOpacity
          style={styles.iconButton}
          onPress={() => handlePress('settings')}
        >
          <VinaupCog width={24} height={24} />
        </PressableOpacity>
      </View>

      <PersonalHomeIndexSummary receiptPayments={receiptPaymentsInProjectSelf} />

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
          onChange={(vals) => setUtilities(vals as PersonalUtilityKey[])}
          placeholder="Tiện ích"
          heightPercentage={0.3}
          renderTrigger={
            <Feather name="edit" size={20} color={COLORS.vinaupTeal} />
          }
        />
      </View>

      <IndexUtilityGrid items={visibleUtilities} onItemPress={handlePress} />
      {/* <Carousel /> */}
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
});
