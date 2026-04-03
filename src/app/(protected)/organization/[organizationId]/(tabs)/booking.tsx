import Loader from '@/components/primitives/loader';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from 'fetchwire';
import { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import dayjs from 'dayjs';
import { FontAwesome5 } from '@expo/vector-icons';
import { getBookingsByOrganizationIdApi } from '@/apis/booking-apis';
import { BookingCard } from '@/components/cards/booking-card';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import { Select } from '@/components/primitives/select';
import { BookingStatusOptions } from '@/constants/booking-constants';
import { useLocalSearchParams } from 'expo-router';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';

export default function OrganizationBookingScreen() {
  const params = useLocalSearchParams<{ organizationId: string }>();
  const { organizationId } = params;

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookingsFn = () =>
    getBookingsByOrganizationIdApi(organizationId, {
      status: statusFilter || undefined,
      month: selectedDate.month() + 1,
      year: selectedDate.year(),
    });

  const {
    data: bookings,
    isLoading,
    executeFetchFn: fetchBookings,
    isRefreshing,
    refreshFetchFn: refreshBookings,
  } = useFetchFn(fetchBookingsFn, {
    tags: ['organization-booking-list'],
  });

  useEffect(() => {
    if (!organizationId) return;
    fetchBookings();
  }, [fetchBookings, selectedDate, organizationId, statusFilter]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <MonthYearPicker
          leftSection={
            <FontAwesome5 name="calendar-alt" size={18} color={COLORS.vinaupTeal} />
          }
          value={selectedDate}
          onChange={setSelectedDate}
          displayFormat="MM/YYYY"
          style={{
            dateText: styles.dateText,
          }}
        />
        <View style={styles.statusFilter}>
          <Select
            renderTrigger={(option) => (
              <>
                <VinaupVerticalExpandArrow width={18} height={18} />
                <Text style={{ color: COLORS.vinaupTeal }}>
                  {option.label || 'Trạng thái'}
                </Text>
              </>
            )}
            options={BookingStatusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            placeholder="Trạng thái"
            style={{
              triggerText: {
                fontSize: 16,
                color: COLORS.vinaupTeal,
              },
            }}
          />
        </View>
      </View>
      {!isLoading && (
        <FlatList
          data={bookings}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookingCard booking={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshBookings}
              colors={[COLORS.vinaupTeal]}
            />
          }
        />
      )}
      {isLoading && <Loader size={64} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
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
  dateText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  separator: {
    height: 2,
  },
});
