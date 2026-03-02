import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import VinaupUtilityIcon from '@/components/icons/vinaup-utility-icon.native';
import VinaupCog from '@/components/icons/vinaup-cog.native';
import { useEffect } from 'react';
import { getReceiptPaymentsByCurrentUserApi } from '@/apis/receipt-payment-apis';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { getProjectsOfCurrentUserApi } from '@/apis/project-apis';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';

export default function PersonalIndexScreen() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const dateLabel = `${day}/${month}`;

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
    fetchReceiptPaymentsSelf(() => getReceiptPaymentsByCurrentUserApi());
  }, [fetchReceiptPaymentsSelf]);

  useEffect(() => {
    fetchProjectsSelf(() =>
      getProjectsOfCurrentUserApi({
        type: 'SELF',
        date: new Date(),
      })
    );
  }, [fetchProjectsSelf]);

  useEffect(() => {
    fetchProjectsCompany(() =>
      getProjectsOfCurrentUserApi({
        type: 'COMPANY',
        date: new Date(),
      })
    );
  }, [fetchProjectsCompany]);

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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          // Tùy chỉnh màu sắc (iOS & Android)
          colors={[COLORS.vinaupTeal]}
          tintColor={COLORS.vinaupTeal}
        />
      }
    >
      <View style={styles.topRow}>
        <Text style={styles.dateText}>{dateLabel}</Text>
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
        <Pressable
          style={styles.iconButton}
          onPress={() => handlePress('edit-utilities')}
        >
          <Feather name="edit" size={24} color={COLORS.vinaupTeal} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Pressable
          style={[styles.cardRow, styles.cardRowDivider]}
          onPress={() => handlePress('personal-cashflow')}
        >
          <Text style={styles.cardLabel}>Thu chi ngày</Text>
          <Text style={styles.cardValue}>
            {calculateReceiptPaymentsSummary(receiptPaymentsSelf).totalRemaining}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.cardRow, styles.cardRowDivider]}
          onPress={() => handlePress('tour-schedule')}
        >
          <Text style={styles.cardLabel}>Lịch tour & Tiền công</Text>
          <Text style={styles.cardValue}>({projectsSelf?.length || 0})</Text>
        </Pressable>

        <Pressable
          style={[styles.cardRow]}
          onPress={() => handlePress('tour-cashflow')}
        >
          <Text style={styles.cardLabel}>Thu chi dự án</Text>
          <Text style={styles.cardValue}>({projectsCompany?.length || 0})</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.vinaupSoftGray,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  iconButton: {
    width: 36,
    height: 36,
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
    fontWeight: '400',
  },
  card: {
    marginTop: 8,
    backgroundColor: COLORS.vinaupWhite,
    borderRadius: 14,
    paddingHorizontal: 12,
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
    fontWeight: '700',
    color: COLORS.vinaupTeal,
  },
  cardValue: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
  },
});
