import { COLORS } from '@/constants/style-constant';
import { useFetch } from 'fetchwire';
import { Suspense, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { FontAwesome5 } from '@expo/vector-icons';
import { getProjectsOfCurrentUserApi } from '@/apis/project-apis';
import { getReceiptPaymentsByProjectIdsApi } from '@/apis/receipt-payment-apis';
import { ProjectCard } from '@/components/cards/project-card';
import { ReceiptPaymentsSummary } from '@/components/summaries/receipt-payments-summary';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import { Select } from '@/components/primitives/select';
import { ProjectStatusOptions } from '@/constants/project-constants';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { EntityListSectionSkeleton } from '@/components/skeletons/entity-list-section-skeleton';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';

interface ProjectListSectionProps {
  projectType: 'SELF' | 'COMPANY';
  selectedDate: dayjs.Dayjs;
  projectStatusFilter: string;
}

function ProjectListSection({
  projectType,
  selectedDate,
  projectStatusFilter,
}: ProjectListSectionProps) {
  const fetchProjectsAndReceiptPaymentsFn = async () => {
    const projectsRes = await getProjectsOfCurrentUserApi({
      type: projectType,
      status: projectStatusFilter,
      month: selectedDate.month() + 1,
      year: selectedDate.year(),
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

  const fetchKey = `personal-project-list-${projectType}-${selectedDate.format('YYYY-MM')}-${projectStatusFilter}`;

  const { data, refreshFetch } = useFetch<{
    projects: ProjectResponse[];
    allReceiptPayments: ReceiptPaymentResponse[];
  }>(fetchProjectsAndReceiptPaymentsFn, fetchKey, {
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
        renderItem={({ item }) => <ProjectCard project={item} />}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refreshFetch}
            colors={[COLORS.vinaupTeal]}
          />
        }
      />
      <ReceiptPaymentsSummary receiptPayments={allReceiptPayments} />
    </View>
  );
}

type PersonalProjectListContentProps = {
  projectType: 'SELF' | 'COMPANY';
};

export function PersonalProjectListContent({
  projectType,
}: PersonalProjectListContentProps) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [projectStatusFilter, setProjectStatusFilter] = useState('');

  const suspenseResetKey = `personal-project-list-${projectType}-${selectedDate.format('YYYY-MM')}-${projectStatusFilter}`;

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
            renderTrigger={(option) => (
              <>
                <VinaupVerticalExpandArrow width={18} height={18} />
                <Text style={{ color: COLORS.vinaupTeal }}>
                  {option.label || 'Trạng thái'}
                </Text>
              </>
            )}
            options={ProjectStatusOptions}
            value={projectStatusFilter}
            onChange={(value) => setProjectStatusFilter(value)}
            placeholder="Trạng thái"
            style={{
              triggerText: {
                fontSize: 16,
                color: COLORS.vinaupTeal,
              },
            }}
          />
        </View>
      </View>
      <Suspense fallback={<EntityListSectionSkeleton />}>
        <ProjectListSection
          key={suspenseResetKey}
          projectType={projectType}
          selectedDate={selectedDate}
          projectStatusFilter={projectStatusFilter}
        />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
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
