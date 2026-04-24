import React from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { prefetch, useFetch, useMutationFn } from 'fetchwire';
import { createBookingApi, getBookingByIdApi, getBookingsByTourImplementationIdApi } from '@/apis/booking-apis';
import { BookingCard } from '@/components/cards/booking-card';
import { Button } from '@/components/primitives/button';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { COLORS } from '@/constants/style-constant';
import { useNavigationStore } from '@/hooks/use-navigation-store';

interface Props {
  tourImplementationId: string;
  organizationId: string;
}

export function BookingTourImplementationTabPanelContent({ tourImplementationId, organizationId }: Props) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const createBookingFn = () =>
    createBookingApi({
      description: 'Booking tour',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      organizationId,
      tourImplementationId,
    });

  const { executeMutationFn: createBooking, isMutating } = useMutationFn(createBookingFn, {
    invalidatesTags: ['organization-booking-list', `organization-booking-list-in-tour-impl-${tourImplementationId}`],
  });

  const { data: bookings, refreshFetch, isRefreshing } = useFetch(
    () => getBookingsByTourImplementationIdApi(tourImplementationId),
    `organization-booking-list-in-tour-impl-${tourImplementationId}`,
    { tags: [`organization-booking-list-in-tour-impl-${tourImplementationId}`] }
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
          await prefetch(`organization-booking-${bookingId}`, () => getBookingByIdApi(bookingId));
        } catch {
          // Fallback to normal navigation if prefetch fails.
        }
        setIsNavigating(false);

        router.push({
          pathname: '/(protected)/booking-detail/[bookingId]',
          params: { bookingId },
        });
      },
      onError: (error) => Alert.alert('Lỗi', error.message || 'Không thể tạo Booking mới'),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleLeft}>Tạo mới</Text>
          <Text style={styles.titleRight}> Booking</Text>
        </View>
        <Button onPress={handleAddNew} isLoading={isMutating} loaderStyle={{ size: 30 }}>
          <VinaupAddNew width={30} height={30} />
        </Button>
      </View>

      <FlatList
        data={bookings ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} isReceiver={false} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing ?? false}
            onRefresh={refreshFetch}
            colors={[COLORS.vinaupTeal]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
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
  separator: {
    height: 2,
  },
});
