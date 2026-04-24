import React, { useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { prefetch, useFetch, useMutationFn } from 'fetchwire';
import dayjs from 'dayjs';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { createBookingApi, getBookingByIdApi, getBookingsByTourImplementationIdApi } from '@/apis/booking-apis';
import { BookingCard } from '@/components/cards/booking-card';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
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
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const fetchKey = `organization-booking-list-in-tour-implementation-${tourImplementationId}-${selectedDate.format('YYYY-MM')}`;
  const tag = `organization-booking-list-in-tour-implementation-${tourImplementationId}`;

  const createBookingFn = () =>
    createBookingApi({
      description: 'Booking tour',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      organizationId,
      tourImplementationId,
    });

  const { executeMutationFn: createBooking, isMutating } = useMutationFn(createBookingFn, {
    invalidatesTags: ['organization-booking-list', tag],
  });

  const { data: bookings, refreshFetch, isRefreshing } = useFetch(
    () =>
      getBookingsByTourImplementationIdApi(tourImplementationId, {
        startDate: selectedDate.startOf('month').toISOString(),
        endDate: selectedDate.endOf('month').toISOString(),
      }),
    {
      fetchKey,
      tags: [tag],
    }
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
        <MonthYearPicker
          leftSection={
            <FontAwesome5 name="calendar-alt" size={18} color={COLORS.vinaupTeal} />
          }
          value={selectedDate}
          onChange={setSelectedDate}
          displayFormat="MM/YYYY"
          style={{ dateText: styles.dateText }}
        />
        <Pressable onPress={handleAddNew} disabled={isMutating}>
          <VinaupAddNew width={24} height={24} iconColor={COLORS.vinaupWhite} />
        </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  dateText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  separator: {
    height: 2,
  },
});
