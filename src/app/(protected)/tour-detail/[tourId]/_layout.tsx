import { View, StyleSheet, Alert, Text } from 'react-native';
import { Slot, useLocalSearchParams, useRouter, useSegments } from 'expo-router';
import { StackWithHeader } from '@/components/commons/headers/stack-with-header';
import { useMutationFn, type ApiError } from 'fetchwire';
import { COLORS } from '@/constants/style-constant';
import { deleteTourApi } from '@/apis/tour/tour';
import { Entypo, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import VinaupSaveAndExit from '@/components/icons/vinaup-save-and-exit.native';
import { OrganizationTourDetailTabListContent } from '@/components/organization/tour/detail/organization-tour-detail-tab-list-content';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TourDetailProvider,
  useTourDetailContext,
} from '@/providers/tour-detail-provider';
import { Select } from '@/components/primitives/select';
import { TourStatus, TourStatusOptions } from '@/constants/tour-constants';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { useNavigationStore } from '@/hooks/use-navigation-store';

function TourDetailLayoutContent() {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();
  const { tourId } = useLocalSearchParams<{
    tourId: string;
  }>();
  const {
    tour,
    isRefreshingTour,
    isUpdatingTour,
    handleUpdateTour,
    refreshTour,
  } = useTourDetailContext();

  const segments = useSegments();
  const tab = segments[segments.length - 1];

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
          setIsNavigating(true);
          deleteTour({
            onSuccess: () => {
              setIsNavigating(false);
              router.back();
            },
            onError: (error: ApiError) => {
              setIsNavigating(false);
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  };

  const handleSaveAndExit = () => {
    if (!tour) return;
    refreshTour();
    router.back();
  };

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
            value={tour?.status || ''}
            onChange={(value) => handleUpdateTour({ status: value as TourStatus })}
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
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.slotContainer}>
          <Slot />
        </View>
      </View>
    </>
  );
}

export default function TourDetailLayout() {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();

  return (
    <TourDetailProvider tourId={tourId}>
      <TourDetailLayoutContent />
    </TourDetailProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
