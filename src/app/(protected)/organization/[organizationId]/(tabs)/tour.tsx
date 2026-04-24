import { COLORS } from '@/constants/style-constant';
import { Suspense, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Select } from '@/components/primitives/select';
import { TourStatusOptions } from '@/constants/tour-constants';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { EntityListSectionSkeleton } from '@/components/skeletons/entity-list-section-skeleton';
import { OrganizationTourListSectionContent } from '@/components/contents/tour/organization-tour-list-section-content';

export default function OrganizationTourScreen() {
  const params = useLocalSearchParams<{ organizationId: string }>();
  const { organizationId } = params;

  const [tourStatusFilter, setTourStatusFilter] = useState('');

  const suspenseKey = `org-tour-list-${organizationId}-${tourStatusFilter}`;

  return (
    <View style={styles.container}>
      <View style={styles.tourtopContainer}>
        <View style={styles.statusFilter}>
          <Select
            options={TourStatusOptions}
            value={tourStatusFilter}
            onChange={(value) => setTourStatusFilter(value)}
            placeholder="Trạng thái"
            renderTrigger={(option) => (
              <>
                <VinaupVerticalExpandArrow width={18} height={18} />
                <Text style={styles.statusFilterText}>
                  {option.label || 'Trạng thái'}
                </Text>
              </>
            )}
          />
        </View>
      </View>
      <Suspense fallback={<EntityListSectionSkeleton />}>
        <OrganizationTourListSectionContent
          key={suspenseKey}
          organizationId={organizationId}
          tourStatusFilter={tourStatusFilter}
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
