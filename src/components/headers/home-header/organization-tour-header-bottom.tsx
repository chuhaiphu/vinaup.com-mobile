import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../primitives/button';
import VinaupAddNew from '../../icons/vinaup-add-new.native';
import { COLORS } from '@/constants/style-constant';
import { useMutationFn } from 'fetchwire';
import { createTourApi } from '@/apis/tour-apis';
import dayjs from 'dayjs';

const OrganizationTourHeaderBottom = () => {
  const router = useRouter();
  const { organizationId } = useLocalSearchParams<{ organizationId: string }>();

  const createTourFn = () =>
    createTourApi({
      description: 'Tiêu đề tour',
      organizationId,
      externalCustomerName: 'Khách lẻ',
      startDate: dayjs().toDate(),
      endDate: dayjs().add(3, 'day').toDate(),
    });

  const { executeMutationFn: createTour, isMutating } = useMutationFn(
    createTourFn,
    { invalidatesTags: ['organization-tour-list'] }
  );

  const handleAddNew = async () => {
    await createTour({
      onSuccess: (data) => {
        router.push({
          pathname: '/(protected)/tour-detail/[tourId]',
          params: { tourId: data ? data.id : '' },
        });
      },
      onError: (error) =>
        Alert.alert('Lỗi', error.message || 'Không thể tạo tour mới'),
    });
  };

  return (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>Tour</Text>
        <Text style={styles.titleRight}> Trong nước</Text>
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
  titleRight: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
});

export default OrganizationTourHeaderBottom;
