import { COLORS } from '@/constants/style-constant';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { useState } from 'react';
import dayjs from 'dayjs';
import { Select } from '@/components/primitives/select';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { BookingStatusOptions, BookingType } from '@/constants/booking-constants';
import { BookingCard } from '@/components/cards/booking-card';
import { getBookingsByOrganizationIdApi } from '@/apis/booking-apis';
import { useFetch } from 'fetchwire';

export default function OrganizationBookingScreen() {
  const { type, organizationId } = useLocalSearchParams<{
    organizationId: string;
    type: string;
  }>();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookingsFn = () => {
    return getBookingsByOrganizationIdApi(organizationId, {
      type: type as BookingType,
      status: statusFilter || undefined,
      startDate: selectedDate.startOf('month').toISOString(),
      endDate: selectedDate.endOf('month').toISOString(),
    });
  };

  const fetchKey = `org-booking-list-${organizationId}-${type}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

  const {
    data: bookings,
    refreshFetch,
    isRefreshing,
  } = useFetch(fetchBookingsFn, fetchKey, {
    tags: ['organization-booking-list'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
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
      <BookingCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    marginHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.vinaupLightGray,
    borderBottomWidth: 1,
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
});
