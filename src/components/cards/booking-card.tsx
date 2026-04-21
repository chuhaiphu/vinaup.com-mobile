import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { BookingResponse } from '@/interfaces/booking-interfaces';
import VinaupUserArrowUpRight from '@/components/icons/vinaup-user-arrow-up-right.native';
import VinaupUserChecked from '@/components/icons/vinaup-user-checked.native';
import dayjs from 'dayjs';
import { prefetch } from 'fetchwire';
import { getBookingByIdApi } from '@/apis/booking-apis';
import { useRouter } from 'expo-router';
import { useNavigationStore } from '@/hooks/use-navigation-store';

interface BookingCardProps {
  booking?: BookingResponse;
}

export function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const startDate = booking?.startDate
    ? dayjs(booking.startDate).format('DD/MM')
    : '--';
  const endDate = booking?.endDate
    ? dayjs(booking.endDate).format('DD/MM/YY')
    : '--';
  const description = booking?.description || 'Booking mới';
  const senderName = booking?.organization?.name || '---';
  const receiverName = booking?.organizationCustomer?.name || 'Chưa xác định';

  const navigateToDetail = async (bookingId: string) => {
    setIsNavigating(true);
    try {
      await prefetch(`organization-booking-${bookingId}`, () =>
        getBookingByIdApi(bookingId)
      );
    } catch {
      // Fallback to normal navigation if prefetch fails.
    }
    router.push({
      pathname: '/(protected)/booking-detail/[bookingId]',
      params: { bookingId },
    });
    setIsNavigating(false);
  };

  return (
    <Pressable onPress={() => booking && navigateToDetail(booking.id)}>
      <View style={styles.container}>
        <View style={styles.innerCard}>
          <View style={styles.topSection}>
            <View style={styles.topRow}>
              <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                {description}
              </Text>
            </View>
            <View style={styles.topRow}>
              <Text style={styles.dateText}>
                Từ {startDate} đến {endDate}
              </Text>
              <Text style={styles.codeText}>No. {booking?.code}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.bottomSection}>
            <View style={styles.senderInfo}>
              <View style={styles.labelRow}>
                <VinaupUserArrowUpRight width={13} height={15} />
                <Text style={styles.label}>Gửi bởi</Text>
              </View>
              <Text style={styles.senderText} numberOfLines={1}>
                {senderName}
              </Text>
            </View>
            <View style={styles.receiverInfo}>
              <View style={[styles.labelRow, styles.receiverLabelRow]}>
                <Text style={styles.label}>Nhận bởi</Text>
                <VinaupUserChecked width={13} height={15} />
              </View>
              <Text
                style={[styles.receiverText, styles.receiverTextRight]}
                numberOfLines={1}
              >
                {receiverName}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  innerCard: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.vinaupSoftYellow,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.vinaupBlack,
    marginHorizontal: 8,
  },
  topSection: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 14,
  },
  codeText: {
    fontSize: 14,
  },
  bottomSection: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  senderInfo: {},
  receiverInfo: {},
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  receiverLabelRow: {
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 15,
  },
  senderText: {
    fontSize: 16,
    color: COLORS.vinaupOrange,
  },
  receiverText: {
    fontSize: 16,
    color: COLORS.vinaupBlueDark,
  },
  receiverTextRight: {
    textAlign: 'right',
  },
});
