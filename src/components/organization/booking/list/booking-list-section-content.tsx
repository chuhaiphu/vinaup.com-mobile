import { COLORS } from '@/constants/style-constant';
import { useFetch } from 'fetchwire';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import {
  getBookingsByOrganizationIdApi,
  getBookingsByOrganizationCustomerOrganizationIdApi,
  getBookingsByTourImplementationIdApi,
} from '@/apis/booking/booking';
import { BookingCard } from '@/components/organization/booking/booking-card';

export interface BookingListSectionContentProps {
  organizationId: string;
  selectedDate: dayjs.Dayjs;
  statusFilter?: string;
  tourImplementationId?: string;
}

function BookingListByOrganization({ organizationId, selectedDate, statusFilter }: BookingListSectionContentProps) {
  const filter = {
    status: statusFilter || undefined,
    startDate: selectedDate.startOf('month').toISOString(),
    endDate: selectedDate.endOf('month').toISOString(),
  };

  const senderKey = `organization-booking-sender-list-${organizationId}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;
  const receiverKey = `organization-booking-receiver-list-${organizationId}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  const { data: senderBookings, refreshFetch: refreshSender, isRefreshing: isSenderRefreshing } =
    useFetch(() => getBookingsByOrganizationIdApi(organizationId, filter), {
      fetchKey: senderKey,
      tags: ['organization-booking-list'],
    });

  const { data: receiverBookings, refreshFetch: refreshReceiver, isRefreshing: isReceiverRefreshing } =
    useFetch(() => getBookingsByOrganizationCustomerOrganizationIdApi(organizationId, filter), {
      fetchKey: receiverKey,
      tags: ['organization-booking-list'],
    });

  const combinedBookings = [
    ...(senderBookings ?? []),
    ...(receiverBookings ?? []),
  ].sort((a, b) => dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf());

  const handleRefresh = () => {
    refreshSender();
    refreshReceiver();
  };

  return (
    <FlatList
      data={combinedBookings}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <BookingCard booking={item} isReceiver={!item.meta.isSender} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isSenderRefreshing || isReceiverRefreshing}
          onRefresh={handleRefresh}
          colors={[COLORS.vinaupTeal]}
        />
      }
    />
  );
}

function BookingListByTourImplementation({ tourImplementationId, selectedDate, statusFilter }: BookingListSectionContentProps) {
  const filter = {
    status: statusFilter || undefined,
    startDate: selectedDate.startOf('month').toISOString(),
    endDate: selectedDate.endOf('month').toISOString(),
  };

  const fetchKey = `organization-booking-list-in-tour-implementation-${tourImplementationId}-${selectedDate.format('YYYY-MM')}`;

  const { data: bookings, refreshFetch, isRefreshing } =
    useFetch(() => getBookingsByTourImplementationIdApi(tourImplementationId!, filter), {
      fetchKey,
      tags: [`organization-booking-list-in-tour-implementation-${tourImplementationId}`],
    });

  return (
    <FlatList
      data={bookings ?? []}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BookingCard booking={item} isReceiver={false} />}
      scrollEnabled={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing ?? false}
          onRefresh={refreshFetch}
          colors={[COLORS.vinaupTeal]}
        />
      }
    />
  );
}

export function BookingListSectionContent(props: BookingListSectionContentProps) {
  if (props.tourImplementationId) {
    return <BookingListByTourImplementation {...props} />;
  }
  return <BookingListByOrganization {...props} />;
}

const styles = StyleSheet.create({
  separator: {
    height: 2,
  },
});
