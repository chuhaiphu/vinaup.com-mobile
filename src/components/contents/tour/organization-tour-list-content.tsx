import { COLORS } from '@/constants/style-constant';
import { prefetch, useFetch } from 'fetchwire';
import { Suspense, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Select } from '@/components/primitives/select';
import { TourStatusOptions } from '@/constants/tour-constants';
import { getTourByIdApi, getToursByOrganizationIdApi } from '@/apis/tour-apis';
import { TourCard } from '@/components/cards/tour-card';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { EntityListSectionSkeleton } from '@/components/skeletons/entity-list-section-skeleton';
import Loader from '@/components/primitives/loader';

type TourListSectionProps = {
  organizationId: string;
  tourStatusFilter: string;
};

function TourListSection({
  organizationId,
  tourStatusFilter,
}: TourListSectionProps) {
  const router = useRouter();

  const fetchToursFn = () =>
    getToursByOrganizationIdApi(organizationId, {
      status: tourStatusFilter || undefined,
    });
  const [isNavigating, setIsNavigating] = useState(false);

  const fetchKey = `org-tour-list-${organizationId}-${tourStatusFilter}`;

  const { data: tours, refreshFetch, isRefreshing } = useFetch(fetchToursFn, fetchKey, {
    tags: ['organization-tour-list', organizationId],
  });

  const normalizedTours = tours ?? [];

  const navigateToDetailScreen = async (id?: string) => {
    if (!id) return;
    setIsNavigating(true);
    await prefetch(`tour-detail-${id}`, () => getTourByIdApi(id));
    router.push({
      pathname: '/(protected)/tour-detail/[tourId]',
      params: { tourId: id },
    });
    setIsNavigating(false);
  };

  return (
    <>
      <FlatList
        data={normalizedTours}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigateToDetailScreen(item.id)}>
            <TourCard tour={item} />
          </Pressable>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFetch}
            colors={[COLORS.vinaupTeal]}
          />
        }
      />
      {isNavigating && <Loader withOverlay size={64} />}
    </>
  );
}

type OrganizationTourListContentProps = {
  organizationId: string;
};

export function OrganizationTourListContent({
  organizationId,
}: OrganizationTourListContentProps) {
  const [tourStatusFilter, setTourStatusFilter] = useState('');

  const suspenseResetKey = `org-tour-list-${organizationId}-${tourStatusFilter}`;

  return (
    <View style={styles.container}>
      <View style={styles.tourFilterContainer}>
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
        <TourListSection
          key={suspenseResetKey}
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
  tourFilterContainer: {
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
  separator: {
    height: 2,
  },
});
