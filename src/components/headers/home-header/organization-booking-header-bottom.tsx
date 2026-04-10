import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Button } from '../../primitives/button';
import VinaupAddNew from '../../icons/vinaup-add-new.native';
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
      endDate: new Date(),
      startDate: new Date(),
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
        setIsNavigating(true);
        try {
          await prefetch(`organization-booking-${data?.id}`, () =>
            getBookingByIdApi(data?.id || '')
          );
        } catch {
          // Fallback to normal navigation if prefetch fails.
        }
        setIsNavigating(false);
        router.push({
          pathname: '/(protected)/booking-detail/[bookingId]',
          params: { bookingId: data?.id || '' },
        });
      },
      onError: (error) =>
        Alert.alert('Lỗi', error.message || 'Không thể tạo booking mới'),
    });
  };

  return (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>Booking</Text>
      </View>
      <Button
        onPress={handleAddNew}
        isLoading={isMutating}
        loaderStyle={{ size: 30 }}
      >
        <VinaupAddNew width={30} height={30} />
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLeft: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
  },
});

export default OrganizationBookingHeaderBottom;
