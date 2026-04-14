import { COLORS } from '@/constants/style-constant';
import { prefetch, useFetch } from 'fetchwire';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import {
  getProjectByIdApi,
  getProjectsOfByOrganizationIdApi,
} from '@/apis/project-apis';
import { getReceiptPaymentsByProjectIdsApi } from '@/apis/receipt-payment-apis';
import { ProjectCard } from '@/components/cards/project-card';
import { ReceiptPaymentsSummary } from '@/components/summaries/receipt-payments-summary';
import { PROJECT_TYPE } from '@/constants/project-constants';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useRouter } from 'expo-router';
import { useNavigationStore } from '@/hooks/use-navigation-store';

export interface OrganizationProjectListSectionContentProps {
  organizationId: string;
  selectedDate: dayjs.Dayjs;
  projectStatusFilter: string;
}

export function OrganizationProjectListSectionContent({
  organizationId,
  selectedDate,
  projectStatusFilter,
}: OrganizationProjectListSectionContentProps) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const navigateToDetail = async (project: ProjectResponse) => {
    setIsNavigating(true);
    try {
      await prefetch(`organization-project-${project.id}`, () =>
        getProjectByIdApi(project.id)
      );
    } catch {
      // Fallback to normal navigation if prefetch fails.
    }

    router.push({
      pathname: '/(protected)/project-detail/[projectId]',
      params: {
        projectId: project.id,
        type: PROJECT_TYPE.ORGANIZATION,
      },
    });
    setIsNavigating(false);
  };

  const fetchProjectsAndReceiptPaymentsFn = async () => {
    const projectsRes = await getProjectsOfByOrganizationIdApi(organizationId, {
      type: PROJECT_TYPE.ORGANIZATION,
      status: projectStatusFilter || undefined,
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

  const fetchKey = `organization-project-list-${organizationId}-${selectedDate.format('YYYY-MM')}-${projectStatusFilter}`;

  const { data, refreshFetch, isRefreshing } = useFetch<{
    projects: ProjectResponse[];
    allReceiptPayments: ReceiptPaymentResponse[];
  }>(fetchProjectsAndReceiptPaymentsFn, fetchKey, {
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
