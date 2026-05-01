import React, { Suspense, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { prefetch, useMutationFn } from 'fetchwire';
import dayjs from 'dayjs';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { createBookingApi, getBookingByIdApi } from '@/apis/booking-apis';
import { generateDateCode } from '@/utils/generator/string-generator/generate-date-code';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { COLORS } from '@/constants/style-constant';
import { useNavigationStore } from '@/hooks/use-navigation-store';
import { BookingListSectionContent } from '@/components/organization/booking/list/booking-list-section-content';
import { BookingListSectionSkeleton } from '@/components/commons/skeletons/booking-list-section-skeleton';
import { Button } from '@/components/primitives/button';

interface Props {
  tourImplementationId: string;
  organizationId: string;
}

export function BookingTourImplementationTabPanelContent({
  tourImplementationId,
  organizationId,
}: Props) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const tag = `organization-booking-list-in-tour-implementation-${tourImplementationId}`;
  const suspenseKey = `tour-impl-booking-list-${tourImplementationId}-${selectedDate.format('YYYY-MM')}`;

  const createBookingFn = () =>
    createBookingApi({
      code: generateDateCode(),
      description: 'Booking tour',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      organizationId,
      tourImplementationId,
    });

  const { executeMutationFn: createBooking, isMutating } = useMutationFn(
    createBookingFn,
    {
      invalidatesTags: ['organization-booking-list', tag],
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
          await prefetch(() => getBookingByIdApi(bookingId), {
            fetchKey: `organization-booking-${bookingId}`,
          });
        } catch {
          // Fallback to normal navigation if prefetch fails.
        }
        setIsNavigating(false);

        router.push({
          pathname: '/(protected)/booking-detail/[bookingId]',
          params: { bookingId },
        });
      },
      onError: (error) =>
        Alert.alert('Lỗi', error.message || 'Không thể tạo Booking mới'),
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
        <Button onPress={handleAddNew} isLoading={isMutating}>
          <VinaupAddNew width={24} height={24} iconColor={COLORS.vinaupWhite} />
        </Button>
      </View>

      <Suspense fallback={<BookingListSectionSkeleton />}>
        <BookingListSectionContent
          key={suspenseKey}
          organizationId={organizationId}
          tourImplementationId={tourImplementationId}
          selectedDate={selectedDate}
        />
      </Suspense>
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
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
});
