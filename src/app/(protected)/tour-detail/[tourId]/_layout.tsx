import { View, StyleSheet, Alert, Text } from 'react-native';
import { Slot, useLocalSearchParams, useSegments } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { useEffect } from 'react';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import { Select } from '@/components/primitives/select';
import { COLORS } from '@/constants/style-constant';
import { useSafeRouter } from '@/hooks/use-safe-router';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { getTourByIdApi, updateTourApi } from '@/apis/tour-apis';
import { TourStatus, TourStatusOptions } from '@/constants/tour-constants';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import VinaupSaveAndExit from '@/components/icons/vinaup-save-and-exit.native';
import { OrganizationTourDetailTabListContent } from '@/components/contents/tour/organization-tour-detail-tab-list-content';
import { UpdateTourRequest } from '@/interfaces/tour-interfaces';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';

export default function TourDetailLayout() {
  const safeRouter = useSafeRouter();
  const { tourId } = useLocalSearchParams<{
    tourId: string;
  }>();

  const segments = useSegments();
  const tab = segments[segments.length - 1] as string;
  const fetchTourFn = () => getTourByIdApi(tourId);
  const {
    data: tourData,
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
      <View style={styles.container}>
        <View style={styles.actionContainer}>
          <View style={styles.statusFilter}>
            <Select
              renderTrigger={(option) => (
                <>
                  <VinaupVerticalExpandArrow width={16} height={16} />
                  <Text style={{ color: COLORS.vinaupTeal }}>
                    {option.label || 'Trạng thái'}
                  </Text>
                </>
              )}
              isLoading={isUpdatingTour || isRefreshingTour}
              options={TourStatusOptions}
              value={tourData?.status || ''}
              onChange={(value) =>
                handleUpdateTour({ status: value as TourStatus })
              }
              placeholder="Trạng thái"
              style={{
                triggerText: {
                  fontSize: 16,
                  color: COLORS.vinaupTeal,
                },
              }}
            />
          </View>
          <View style={styles.actionButton}>
            <PressableOpacity style={styles.actionButtonItem}>
              <Text style={styles.actionButtonItemText}>Tour</Text>
            </PressableOpacity>
            <PressableOpacity style={styles.actionButtonItem}>
              <FontAwesome5 name="copy" size={18} color={COLORS.vinaupTeal} />
            </PressableOpacity>
            <PressableOpacity style={styles.actionButtonItem}>
              <Entypo
                name="dots-three-horizontal"
                size={18}
                color={COLORS.vinaupTeal}
              />
            </PressableOpacity>
          </View>
        </View>
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
  actionContainer: {
    marginVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonItem: {},
  actionButtonItemText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotContainer: {
    flex: 1,
  },
});
