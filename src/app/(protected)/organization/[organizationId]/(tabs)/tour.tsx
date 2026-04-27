import { COLORS } from '@/constants/style-constant';
import { Suspense, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Select } from '@/components/primitives/select';
import { TourStatusOptions } from '@/constants/tour-constants';
import { EntityListSectionSkeleton } from '@/components/commons/skeletons/entity-list-section-skeleton';
import { OrganizationTourListSectionContent } from '@/components/organization/tour/list/organization-tour-list-section-content';
import { FontAwesome6 } from '@expo/vector-icons';

export default function OrganizationTourScreen() {
  const params = useLocalSearchParams<{ organizationId: string }>();
  const { organizationId } = params;

  const [statusFilter, setStatusFilter] = useState('');

  const suspenseKey = `org-tour-list-${organizationId}-${statusFilter}`;

  return (
    <View style={styles.container}>
      <View style={styles.tourtopContainer}>
        <View style={styles.statusFilter}>
          <Select
            options={TourStatusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            placeholder="Trạng thái"
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
          />
        </View>
      </View>
      <Suspense fallback={<EntityListSectionSkeleton />}>
        <OrganizationTourListSectionContent
          key={suspenseKey}
          organizationId={organizationId}
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
  tourtopContainer: {
    marginVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusFilterText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
});
