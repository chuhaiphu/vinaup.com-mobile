import { View, StyleSheet, Alert } from 'react-native';
import { Slot, useLocalSearchParams, useRouter, useSegments } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { useEffect } from 'react';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import { COLORS } from '@/constants/style-constant';
import { deleteTourApi, getTourByIdApi } from '@/apis/tour-apis';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import VinaupSaveAndExit from '@/components/icons/vinaup-save-and-exit.native';
import { OrganizationTourDetailTabListContent } from '@/components/contents/tour/organization-tour-detail-tab-list-content';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TourDetailLayout() {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const { tourId } = useLocalSearchParams<{
    tourId: string;
  }>();

  const segments = useSegments();
  const tab = segments[segments.length - 1] as string;
  const fetchTourFn = () => getTourByIdApi(tourId);
  const {
    data: tourData,
    executeFetchFn: fetchTour,
    refreshFetchFn: refreshTour,
  } = useFetchFn(fetchTourFn);

  useEffect(() => {
    if (tourId) {
      fetchTour();
    }
  }, [tourId, fetchTour]);

  const deleteTourFn = () => deleteTourApi(tourId);

  const { executeMutationFn: deleteTour, isMutating: isDeleting } = useMutationFn(
    deleteTourFn,
    {
      invalidatesTags: ['organization-tour-list'],
    }
  );

  const handleDelete = () => {
    if (!tourId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          deleteTour({
            onSuccess: () => {
              router.back();
            },
            onError: (error: ApiError) => {
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  };

  const handleSaveAndExit = () => {
    if (!tourData) return;
    refreshTour();
    router.back();
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
        title={'Chi tiết Tour'}
        backIcon={
          <Ionicons name="chevron-back" size={28} color={COLORS.vinaupTeal} />
        }
        deleteIcon={
          <FontAwesome name="trash-o" size={20} color={COLORS.vinaupTeal} />
        }
        saveIcon={
          <VinaupSaveAndExit width={32} height={24} color={COLORS.vinaupTeal} />
        }
        onDelete={handleDelete}
        isDeleting={isDeleting}
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
