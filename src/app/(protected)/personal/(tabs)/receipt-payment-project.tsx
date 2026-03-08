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
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { getProjectsOfCurrentUserApi } from '@/apis/project-apis';
import { getReceiptPaymentsByProjectIdsApi } from '@/apis/receipt-payment-apis';
import { ProjectCard } from '@/components/cards/project-card';
import { ReceiptPaymentsSummary } from '@/components/summaries/receipt-payments-summary';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import { Select } from '@/components/primitives/select';
import { ProjectStatusOptions } from '@/constants/project-constants';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useLocalSearchParams } from 'expo-router';

export default function PersonalReceiptPaymentProject() {
  const safeRouter = useSafeRouter();
  const params = useLocalSearchParams<{ projectType: 'SELF' | 'COMPANY' }>();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [projectStatusFilter, setProjectStatusFilter] = useState('');

  const {
    data: projects,
    isLoading,
    executeFetchFn: fetchProjects,
    isRefreshing: isRefreshingProjects,
    refreshFetchFn: refreshProjects,
  } = useFetchFn<ProjectResponse[]>({
    tags: ['personal-project-list'],
  });

  const {
    data: allReceiptPayments,
    executeFetchFn: fetchAllReceiptPayments,
  } = useFetchFn<ReceiptPaymentResponse[]>({
    tags: ['personal-receipt-payment-list-all-projects'],
  });

  useEffect(() => {
    fetchProjects(() =>
      getProjectsOfCurrentUserApi({
        type: params.projectType || 'SELF',
        status: projectStatusFilter,
        month: selectedDate.month() + 1,
        year: selectedDate.year(),
      })
    );
  }, [fetchProjects, selectedDate, params.projectType, projectStatusFilter]);

  useEffect(() => {
    if (!projects || projects.length === 0) return;
    const projectIds = projects.map((p) => p.id);
    fetchAllReceiptPayments(() => getReceiptPaymentsByProjectIdsApi(projectIds));
  }, [projects, fetchAllReceiptPayments]);

  const navigateToFormScreen = async (id?: string) => {
    if (safeRouter.isNavigating) return;
    if (id) {
      safeRouter.safePush({
        pathname: '/(protected)/personal/project-detail/[projectId]',
        params: { projectId: id },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.projectFilterContainer}>
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
            options={ProjectStatusOptions}
            value={projectStatusFilter}
            onChange={(value) => setProjectStatusFilter(value)}
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
          data={projects}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigateToFormScreen(item.id)}>
              <ProjectCard project={item} />
            </Pressable>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingProjects}
              onRefresh={refreshProjects}
              colors={[COLORS.vinaupTeal]}
            />
          }
        />
      )}
      {isLoading && <Loader size={64} />}

      {!isLoading && (
        <ReceiptPaymentsSummary receiptPayments={allReceiptPayments} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  left: {
    fontSize: 18,
  },
  right: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  createButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectFilterContainer: {
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
