import Loader from '@/components/primitives/loader';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from 'fetchwire';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeRouter } from '@/hooks/use-safe-router';
import { Select } from '@/components/primitives/select';
import { TourStatusOptions } from '@/constants/tour-constants';
import { getToursByOrganizationIdApi } from '@/apis/tour-apis';
import { TourCard } from '@/components/cards/tour-card';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';

type OrganizationTourListContentProps = {
  organizationId: string;
};

export function OrganizationTourListContent({
  organizationId,
}: OrganizationTourListContentProps) {
  const safeRouter = useSafeRouter();
  const [tourStatusFilter, setTourStatusFilter] = useState('');
  const {
    data: tours,
    isLoading,
    executeFetchFn: fetchTours,
    isRefreshing: isRefreshingTours,
    refreshFetchFn: refreshTours,
  } = useFetchFn(
    () =>
      getToursByOrganizationIdApi(organizationId, {
        status: tourStatusFilter || undefined,
      }),
    {
      tags: ['organization-tour-list', organizationId],
    }
  );
  useEffect(() => {
    if (!organizationId) return;
    fetchTours();
  }, [fetchTours, organizationId, tourStatusFilter]);

  const navigateToDetailScreen = async (id?: string) => {
    if (safeRouter.isNavigating) return;
    if (id) {
      safeRouter.safePush({
        pathname: '/(protected)/tour-detail/[tourId]',
        params: { tourId: id },
      });
    }
  };

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
      {!isLoading && (
        <FlatList
          data={tours}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigateToDetailScreen(item.id)}>
              <TourCard tour={item} />
            </Pressable>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingTours}
              onRefresh={refreshTours}
              colors={[COLORS.vinaupTeal]}
            />
          }
        />
      )}
      {isLoading && <Loader size={64} />}
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
