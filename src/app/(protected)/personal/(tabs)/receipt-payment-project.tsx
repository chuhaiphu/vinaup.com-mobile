import Loader from '@/components/primitives/loader';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '@/components/primitives/button';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { useSafeRouter } from '@/hooks/use-safe-router';
import dayjs from 'dayjs';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { TextSwitcher } from '@/components/primitives/text-switcher';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { getProjectsOfCurrentUserApi } from '@/apis/project-apis';
import { ProjectCard } from '@/components/cards/project-card';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import { Select } from '@/components/primitives/select';
import { ProjectStatusOptions } from '@/constants/project-constants';

export default function ReceiptPaymentProject() {
  const safeRouter = useSafeRouter();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [projectTypeIndex, setProjectTypeIndex] = useState(0);
  const [projectStatusFilter, setProjectStatusFilter] = useState('');

  const {
    data: projects,
    isLoading,
    executeFetchFn: fetchProjects,
    isRefreshing: isRefreshingProjects,
    refreshFetchFn: refreshProjects,
  } = useFetchFn<ProjectResponse[]>({
    invalidateTags: ['personal-receipt-payment-project'],
  });

  useEffect(() => {
    fetchProjects(() =>
      getProjectsOfCurrentUserApi({
        type: projectTypeIndex === 0 ? 'SELF' : 'COMPANY',
        status: projectStatusFilter,
        month: selectedDate.month() + 1,
        year: selectedDate.year(),
      })
    );
  }, [fetchProjects, selectedDate, projectTypeIndex, projectStatusFilter]);

  const navigateToFormScreen = async (id?: string) => {
    if (safeRouter.isNavigating) return;
    if (id) {
      safeRouter.safePush({
        pathname: '/(protected)/personal/project/[id]/project-detail',
        params: { id },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.projectFilterContainer}>
          <MonthYearPicker
            leftSection={
              <FontAwesome5
                name="calendar-alt"
                size={18}
                color={COLORS.vinaupTeal}
              />
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
            />
          </View>
        </View>
        <View style={styles.titleRow}>
          <View style={styles.screenTitleContainer}>
            <Text style={styles.left}>Thu chi </Text>
            <TextSwitcher
              textPair={['Tiền công', 'Dự án']}
              currentIndex={projectTypeIndex}
              onToggle={() => setProjectTypeIndex(projectTypeIndex === 0 ? 1 : 0)}
              rightSection={
                <FontAwesome6
                  name="caret-down"
                  size={20}
                  color={COLORS.vinaupTeal}
                />
              }
            />
          </View>
          <Button
            style={styles.createButtonContainer}
            onPress={() => navigateToFormScreen()}
            isLoading={safeRouter.isNavigating}
          >
            <VinaupAddNew width={32} height={32} />
          </Button>
        </View>
      </View>
      <FlatList
        data={projects}
        contentContainerStyle={{ paddingVertical: 8 }}
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
      {isLoading && <Loader size={64} />}
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
  screenTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: COLORS.vinaupLightGreen,
    borderRadius: 10,
  },
  createButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectFilterContainer: {
    marginVertical: 12,
    paddingHorizontal: 12,
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
    height: 10,
  },
});
