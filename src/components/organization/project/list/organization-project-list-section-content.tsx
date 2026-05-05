import { COLORS } from '@/constants/style-constant';
import { prefetch, useFetch } from 'fetchwire';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import {
  getProjectByIdApi,
  getProjectsOfByOrganizationIdApi,
} from '@/apis/project/project';
import { getReceiptPaymentsByProjectIdsApi } from '@/apis/receipt-payment/receipt-payment';
import { ProjectCard } from '@/components/commons/cards/project-card';
import { ReceiptPaymentsSummary } from '@/components/commons/receipt-payments-summary';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator/calculate-receipt-payments-summary';
import { useRouter } from 'expo-router';
import { useNavigationStore } from '@/hooks/use-navigation-store';

export interface OrganizationProjectListSectionContentProps {
  organizationId: string;
  selectedDate: dayjs.Dayjs;
  statusFilter: string;
}

export function OrganizationProjectListSectionContent({
  organizationId,
  selectedDate,
  statusFilter,
}: OrganizationProjectListSectionContentProps) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const navigateToDetail = async (project: ProjectResponse) => {
    setIsNavigating(true);
    try {
      await prefetch(() => getProjectByIdApi(project.id), {
        fetchKey: `organization-project-${project.id}`,
      });
    } catch {
      // Fallback to normal navigation if prefetch fails.
    }

    router.push({
      pathname: '/(protected)/project-detail/[projectId]',
      params: {
        projectId: project.id,
        organizationId: organizationId,
      },
    });
    setIsNavigating(false);
  };

  const fetchProjectsAndReceiptPaymentsFn = async () => {
    const projectsRes = await getProjectsOfByOrganizationIdApi(organizationId, {
      status: statusFilter || undefined,
      startDate: selectedDate.startOf('month').toISOString(),
      endDate: selectedDate.endOf('month').toISOString(),
    });

    const projects = projectsRes.data ?? [];
    const projectIds = projects.map((project) => project.id);

    let allReceiptPayments: ReceiptPaymentResponse[] = [];
    if (projectIds.length > 0) {
      const rpRes = await getReceiptPaymentsByProjectIdsApi(projectIds);
      allReceiptPayments = rpRes.data ?? [];
    }

    return { projects, allReceiptPayments };
  };

  const fetchKey = `organization-project-list-${organizationId}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  const { data, refreshFetch, isRefreshing } = useFetch<{
    projects: ProjectResponse[];
    allReceiptPayments: ReceiptPaymentResponse[];
  }>(fetchProjectsAndReceiptPaymentsFn, {
    fetchKey,
    tags: ['organization-project-list'],
  });

  const projects = data?.projects ?? [];
  const allReceiptPayments = data?.allReceiptPayments ?? [];

  return (
    <View style={styles.flex1}>
      <FlatList
        data={projects}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const projectRPs = allReceiptPayments.filter((rp) => rp.projectId === item.id);
          const { totalRemaining } = calculateReceiptPaymentsSummary(projectRPs);
          return (
            <ProjectCard
              project={item}
              onPress={() => navigateToDetail(item)}
              totalRemaining={totalRemaining}
            />
          );
        }}
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
