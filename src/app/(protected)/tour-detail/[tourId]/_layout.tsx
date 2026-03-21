import { View, StyleSheet, Alert } from 'react-native';
import { Slot, useLocalSearchParams, useSegments } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { useEffect } from 'react';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import { COLORS } from '@/constants/style-constant';
import { useSafeRouter } from '@/hooks/use-safe-router';
import { getTourByIdApi, updateTourApi } from '@/apis/tour-apis';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import VinaupSaveAndExit from '@/components/icons/vinaup-save-and-exit.native';
import { OrganizationTourDetailTabListContent } from '@/components/contents/tour/organization-tour-detail-tab-list-content';
import { UpdateTourRequest } from '@/interfaces/tour-interfaces';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TourDetailLayout() {
  const insets = useSafeAreaInsets();

  const safeRouter = useSafeRouter();
  const { tourId } = useLocalSearchParams<{
    tourId: string;
  }>();

  const segments = useSegments();
  const tab = segments[segments.length - 1] as string;
  const fetchTourFn = () => getTourByIdApi(tourId);
  const {
    data: tourData,
    isLoading: isLoadingTour,
    isRefreshing: isRefreshingTour,
    executeFetchFn: fetchTour,
    refreshFetchFn: refreshTour,
  } = useFetchFn(fetchTourFn);

  useEffect(() => {
    if (tourId) {
      fetchTour();
    }
  }, [tourId, fetchTour]);

  const updateTourFn = (updatedFields: UpdateTourRequest) =>
    updateTourApi(tourId, updatedFields);

  const { executeMutationFn: updateTour, isMutating: isUpdatingTour } =
    useMutationFn(updateTourFn, {
      invalidatesTags: ['organization-tour-list'],
    });

  const handleUpdateTour = (
    updatedFields: UpdateTourRequest,
    onSuccessCallback?: () => void
  ) => {
    if (!tourData) return;
    updateTour(updatedFields, {
      onSuccess: () => {
        refreshTour();
        onSuccessCallback?.();
      },
      onError: (error: ApiError) => {
        Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
      },
    });
  };

  const handleSaveAndExit = () => {
    if (!tourData) return;
    refreshTour();
    safeRouter.safeBack();
  };

  // const getHeaderTitle = () => {
  //   if (isLoadingProject || !project) {
  //     return '';
  //   }
  //   return project.type === 'SELF' ? 'Chi tiết Tiền công' : 'Chi tiết Dự án';
  // };

  // if (isLoadingProject) {
  //   return (
  //     <View>
  //       <Loader size={64} />
  //     </View>
  //   );
  // }

  return (
    <>
      <StackWithHeader
        title={'Chi tiết tour'}
        backIcon={
          <Ionicons name="chevron-back" size={28} color={COLORS.vinaupTeal} />
        }
        deleteIcon={
          <FontAwesome name="trash-o" size={20} color={COLORS.vinaupTeal} />
        }
        saveIcon={
          <VinaupSaveAndExit width={32} height={24} color={COLORS.vinaupTeal} />
        }
        onDelete={() => {}}
        isDeleting={false}
        onSave={handleSaveAndExit}
        styles={{
          container: styles.headerContainer,
          title: styles.headerTitle,
        }}
      >
        <OrganizationTourDetailTabListContent currentTab={tab} tourId={tourId} />
      </StackWithHeader>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.slotContainer}>
          <Slot />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: COLORS.vinaupWhite,
  },
  headerTitle: {
    fontSize: 20,
    color: COLORS.vinaupTeal,
  },
  headerBackButtonIcon: {
    color: COLORS.vinaupTeal,
  },
  headerDeleteButtonIcon: {
    color: COLORS.vinaupTeal,
  },
  slotContainer: {
    flex: 1,
  },
});
