import { COLORS } from '@/constants/style-constant';
import { useFetch } from 'fetchwire';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import {
  getBookingsByOrganizationIdApi,
  getBookingsByOrganizationCustomerOrganizationIdApi,
} from '@/apis/booking-apis';
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
  const filter = {
    status: statusFilter || undefined,
    startDate: selectedDate.startOf('month').toISOString(),
    endDate: selectedDate.endOf('month').toISOString(),
  };

  const senderKey = `org-booking-sender-${organizationId}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;
  const receiverKey = `org-booking-receiver-${organizationId}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  const { data: senderBookings, refreshFetch: refreshSender, isRefreshing: isSenderRefreshing } =
    useFetch(() => getBookingsByOrganizationIdApi(organizationId, filter), senderKey, {
      tags: ['organization-booking-list'],
    });

  const { data: receiverBookings, refreshFetch: refreshReceiver, isRefreshing: isReceiverRefreshing } =
    useFetch(() => getBookingsByOrganizationCustomerOrganizationIdApi(organizationId, filter), receiverKey, {
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

const styles = StyleSheet.create({
  separator: {
    height: 2,
  },
});
