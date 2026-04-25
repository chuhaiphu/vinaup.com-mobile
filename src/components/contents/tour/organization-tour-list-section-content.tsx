import { COLORS } from '@/constants/style-constant';
import { prefetch, useFetch } from 'fetchwire';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getTourByIdApi, getToursByOrganizationIdApi } from '@/apis/tour-apis';
import { TourCard } from '@/components/cards/tour-card';
import { useNavigationStore } from '@/hooks/use-navigation-store';

export type OrganizationTourListSectionContentProps = {
  organizationId: string;
  statusFilter: string;
};

export function OrganizationTourListSectionContent({
  organizationId,
  statusFilter,
}: OrganizationTourListSectionContentProps) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const fetchToursFn = () =>
    getToursByOrganizationIdApi(organizationId, {
      status: statusFilter || undefined,
    });

  const fetchKey = `organization-tour-list-${organizationId}-${statusFilter}`;

  const {
    data: tours,
    refreshFetch,
    isRefreshing,
  } = useFetch(fetchToursFn, {
    fetchKey,
    tags: ['organization-tour-list'],
  });

  const navigateToDetailScreen = async (id?: string) => {
    if (!id) return;
    setIsNavigating(true);
    try {
      await prefetch(() => getTourByIdApi(id), { fetchKey: `organization-tour-${id}` });
    } catch {
      // Fallback to normal navigation if prefetch fails.
    }
    router.push({
      pathname: '/(protected)/tour-detail/[tourId]',
      params: { tourId: id },
    });
    setIsNavigating(false);
  };

  return (
    <>
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
            refreshing={isRefreshing}
            onRefresh={refreshFetch}
            colors={[COLORS.vinaupTeal]}
          />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 2,
  },
});
