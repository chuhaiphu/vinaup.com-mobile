import { COLORS } from '@/constants/style-constant';
import { useFetch } from 'fetchwire';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import { getBookingsByOrganizationIdApi } from '@/apis/booking-apis';
import { BookingCard } from '@/components/cards/booking-card';

export interface BookingListSectionContentProps {
  organizationId: string;
  selectedDate: dayjs.Dayjs;
  statusFilter: string;
}

export function BookingListSectionContent({
  organizationId,
  selectedDate,
  statusFilter,
}: BookingListSectionContentProps) {
  const fetchBookingsFn = () => {
    return getBookingsByOrganizationIdApi(organizationId, {
      status: statusFilter || undefined,
      startDate: selectedDate.startOf('month').toISOString(),
      endDate: selectedDate.endOf('month').toISOString(),
    });
  };

  const fetchKey = `org-booking-list-${organizationId}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  const {
    data: bookings,
    refreshFetch,
    isRefreshing,
  } = useFetch(fetchBookingsFn, fetchKey, {
    tags: ['organization-booking-list'],
  });

  return (
    <FlatList
      data={bookings}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BookingCard booking={item} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshFetch}
          colors={[COLORS.vinaupTeal]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 2,
  },
});
