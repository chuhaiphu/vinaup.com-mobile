import { COLORS } from '@/constants/style-constant';
import { Suspense, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import { Select } from '@/components/primitives/select';
import { ProjectStatusOptions } from '@/constants/project-constants';
import { EntityListSectionSkeleton } from '@/components/commons/skeletons/entity-list-section-skeleton';
import { OrganizationProjectListSectionContent } from '@/components/organization/project/list/organization-project-list-section-content';
import { useLocalSearchParams } from 'expo-router';

export default function OrganizationProjectScreen() {
  const params = useLocalSearchParams<{ organizationId: string }>();
  const { organizationId } = params;

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [statusFilter, setStatusFilter] = useState('');

  const suspenseKey = `organization-project-list-${organizationId}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  return (
    <View style={styles.container}>
      <View style={styles.projecttopContainer}>
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
                <Text style={styles.statusFilterText}>
                  {option.label || 'Trạng thái'}
                </Text>
                <FontAwesome6
                  name="caret-down"
                  size={20}
                  color={COLORS.vinaupTeal}
                />
              </>
            )}
            options={ProjectStatusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            placeholder="Trạng thái"
          />
        </View>
      </View>
      <Suspense fallback={<EntityListSectionSkeleton />}>
        <OrganizationProjectListSectionContent
          key={suspenseKey}
          organizationId={organizationId}
          selectedDate={selectedDate}
          statusFilter={statusFilter}
        />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  projecttopContainer: {
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
  statusFilterText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
});
