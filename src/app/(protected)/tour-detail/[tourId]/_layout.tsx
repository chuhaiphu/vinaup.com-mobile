import { View, StyleSheet, Alert, Text } from 'react-native';
import { Slot, useLocalSearchParams, useSegments } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { useEffect } from 'react';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import { getReceiptPaymentsByProjectIdApi } from '@/apis/receipt-payment-apis';
import Loader from '@/components/primitives/loader';
import { Select } from '@/components/primitives/select';
import { COLORS } from '@/constants/style-constant';
import { useSafeRouter } from '@/hooks/use-safe-router';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { getTourByIdApi } from '@/apis/tour-apis';
import { TourStatusOptions } from '@/constants/tour-constants';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import VinaupSaveAndExit from '@/components/icons/vinaup-save-and-exit.native';
import { OrganizationTourDetailTabListContent } from '@/components/contents/tour/organization-tour-detail-tab-list-content';

export default function TourDetailLayout() {
  const safeRouter = useSafeRouter();
  const { tourId } = useLocalSearchParams<{
    tourId: string;
  }>();

  const segments = useSegments();
  const tab = segments[segments.length - 1] as string;
  const fetchTourFn = () => getTourByIdApi(tourId);
  const {
    data: tour,
    isLoading: isLoadingTour,
    isRefreshing: isRefreshingTour,
    executeFetchFn: fetchTour,
    refreshFetchFn: refreshTour,
  } = useFetchFn(fetchTourFn);

  const fetchReceiptPaymentsFn = () => getReceiptPaymentsByProjectIdApi(tourId);
  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    isRefreshing: isRefreshingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
    refreshFetchFn: refreshReceiptPayments,
  } = useFetchFn(fetchReceiptPaymentsFn, {
    tags: ['organization-receipt-payment-list-in-tour'],
  });

  useEffect(() => {
    if (tourId) {
      fetchTour();
      fetchReceiptPayments();
    }
  }, [tourId, fetchTour, fetchReceiptPayments]);

  const handleSaveAndExit = () => {
    if (!tour) return;
    refreshTour();
    refreshReceiptPayments();
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
        <OrganizationTourDetailTabListContent currentTab={tab} />
      </StackWithHeader>
      <View style={styles.container}>
        <View style={styles.tourFilterContainer}>
          <View style={styles.statusFilter}>
            <Select
              renderTrigger={(option) => (
                <>
                  <VinaupVerticalExpandArrow width={18} height={18} />
                  <Text style={styles.statusFilterText}>
                    {option.label || 'Trạng thái'}
                  </Text>
                </>
              )}
              isLoading={isRefreshingTour}
              options={TourStatusOptions}
              value={tour?.status || ''}
              onChange={(value) => {}}
              placeholder="Trạng thái"
            />
          </View>
        </View>
        <View>
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
  tourFilterContainer: {
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
});
