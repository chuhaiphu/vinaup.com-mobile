import { COLORS } from '@/constants/style-constant';
import { prefetch, useFetch } from 'fetchwire';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import {
  getProjectByIdApi,
  getProjectsOfCurrentUserApi,
} from '@/apis/project-apis';
import { getReceiptPaymentsByProjectIdsApi } from '@/apis/receipt-payment-apis';
import { ProjectCard } from '@/components/cards/project-card';
import { ReceiptPaymentsSummary } from '@/components/summaries/receipt-payments-summary';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useRouter } from 'expo-router';
import { useNavigationStore } from '@/hooks/use-navigation-store';

export interface PersonalProjectListSectionContentProps {
  selectedDate: dayjs.Dayjs;
  statusFilter: string;
}

export function PersonalProjectListSectionContent({
  selectedDate,
  statusFilter,
}: PersonalProjectListSectionContentProps) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const navigateToDetail = async (project: ProjectResponse) => {
    setIsNavigating(true);
    const fetchKey = project.organizationId
      ? `organization-project-${project.id}`
      : `personal-project-${project.id}`;
    try {
      await prefetch(() => getProjectByIdApi(project.id), { fetchKey });
    } catch {
      // Fallback to normal navigation if prefetch fails.
    }
    router.push({
      pathname: '/(protected)/project-detail/[projectId]',
      params: {
        projectId: project.id,
        organizationId: project.organizationId ?? undefined,
      },
    });
    setIsNavigating(false);
  };

  const fetchProjectsAndReceiptPaymentsFn = async () => {
    const projectsRes = await getProjectsOfCurrentUserApi({
      status: statusFilter || undefined,
      startDate: selectedDate.startOf('month').toISOString(),
      endDate: selectedDate.endOf('month').toISOString(),
    });

    const projects = projectsRes.data ?? [];
    const projectIds = projects.map((p) => p.id);

    let allReceiptPayments: ReceiptPaymentResponse[] = [];
    if (projectIds.length > 0) {
      const rpRes = await getReceiptPaymentsByProjectIdsApi(projectIds);
      allReceiptPayments = rpRes.data ?? [];
    }

    return { projects, allReceiptPayments };
  };

  const fetchKey = `personal-project-list-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  const { data, refreshFetch, isRefreshing } = useFetch<{
    projects: ProjectResponse[];
    allReceiptPayments: ReceiptPaymentResponse[];
  }>(fetchProjectsAndReceiptPaymentsFn, {
    fetchKey,
    tags: ['personal-project-list'],
  });

  const projects = data?.projects ?? [];
  const allReceiptPayments = data?.allReceiptPayments ?? [];

  return (
    <View style={styles.flex1}>
      <FlatList
        data={projects}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProjectCard project={item} onPress={() => navigateToDetail(item)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFetch}
            colors={[COLORS.vinaupTeal]}
          />
        }
      />
      <ReceiptPaymentsSummary receiptPayments={allReceiptPayments} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  separator: {
    height: 2,
  },
});
