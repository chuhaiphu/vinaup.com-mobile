import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Button } from '../../primitives/button';
import VinaupAddNew from '../../icons/vinaup-add-new.native';
import { COLORS } from '@/constants/style-constant';
import { useMutationFn } from 'fetchwire';
import { createBookingApi } from '@/apis/booking-apis';

const OrganizationBookingHeaderBottom = () => {
  const router = useRouter();
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
      onSuccess: (data) => {
        router.push({
          pathname: '/(protected)/booking-detail/[bookingId]',
          params: { bookingId: data.id },
        });
      },
      onError: (error) =>
        Alert.alert('Lỗi', error.message || 'Không thể tạo booking mới'),
    });
  };

  return (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>
          Booking
        </Text>
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
