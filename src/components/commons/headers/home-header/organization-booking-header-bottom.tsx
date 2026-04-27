import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Button } from '@/components/primitives/button';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { COLORS } from '@/constants/style-constant';
import { prefetch, useMutationFn } from 'fetchwire';
import { createBookingApi, getBookingByIdApi } from '@/apis/booking-apis';
import { useNavigationStore } from '@/hooks/use-navigation-store';

const OrganizationBookingHeaderBottom = () => {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();
  const params = useGlobalSearchParams<{
    organizationId: string;
  }>();

  const createBookingFn = () => {
    return createBookingApi({
      description: 'Booking mới',
      endDate: new Date().toISOString(),
      startDate: new Date().toISOString(),
      organizationId: params.organizationId,
    });
  };

  const { executeMutationFn: createBooking, isMutating } = useMutationFn(
    createBookingFn,
    { invalidatesTags: ['organization-booking-list'] }
  );

  const handleAddNew = async () => {
    await createBooking({
      onSuccess: async (data) => {
        const bookingId = data?.id || '';
        if (!bookingId) {
          Alert.alert('Lỗi', 'Không thể tạo Booking mới');
          return;
        }

        setIsNavigating(true);
        try {
          await prefetch(() => getBookingByIdApi(bookingId), {
            fetchKey: `organization-booking-${bookingId}`,
          });
        } catch {
          // Fallback to normal navigation if prefetch fails.
        }
        setIsNavigating(false);

        router.push({
          pathname: '/(protected)/booking-detail/[bookingId]',
          params: { bookingId },
        });
      },
      onError: (error) =>
        Alert.alert('Lỗi', error.message || 'Không thể tạo Booking mới'),
    });
  };

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>Tạo mới</Text>
        <Text style={styles.titleRight}> Booking</Text>
      </View>
      <Button
        onPress={handleAddNew}
        isLoading={isMutating}
        loaderStyle={{ size: 30 }}
      >
        <VinaupAddNew width={30} height={30} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLeft: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
  },
  titleRight: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
});

export default OrganizationBookingHeaderBottom;
