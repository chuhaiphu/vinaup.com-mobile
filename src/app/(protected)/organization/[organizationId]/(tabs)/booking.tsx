import { COLORS } from '@/constants/style-constant';
import { Suspense, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import dayjs from 'dayjs';
import { Select } from '@/components/primitives/select';
import { BookingStatusOptions } from '@/constants/booking-constants';
import { BookingListSectionSkeleton } from '@/components/commons/skeletons/booking-list-section-skeleton';
import { BookingListSectionContent } from '@/components/organization/booking/list/booking-list-section-content';
import { FontAwesome6 } from '@expo/vector-icons';

export default function OrganizationBookingScreen() {
  const { organizationId } = useLocalSearchParams<{ organizationId: string }>();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [statusFilter, setStatusFilter] = useState('');

  const suspenseKey = `org-booking-list-${organizationId}-${selectedDate.format('YYYY-MM')}-${statusFilter}`;

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
                <Text style={styles.statusFilterText}>
                  {option.label || 'Trạng thái'}
                </Text>
                <FontAwesome6
                  name="caret-down"
                  size={20}
                  color={COLORS.vinaupTeal}
                />
              </>
            )}
            options={BookingStatusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            placeholder="Trạng thái"
          />
        </View>
      </View>
      <Suspense fallback={<BookingListSectionSkeleton />}>
        <BookingListSectionContent
          key={suspenseKey}
          organizationId={organizationId}
          selectedDate={selectedDate}
          statusFilter={statusFilter}
        />
      </Suspense>
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
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusFilterText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
});
