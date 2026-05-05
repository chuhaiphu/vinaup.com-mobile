import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { DD_MM_DATE_FORMAT_SHORT } from '@/constants/app-constant';
import { BookingMeta, BookingResponse } from '@/interfaces/booking-interfaces';
import { ResponseWithMeta } from '@/interfaces/_meta.interfaces';
import VinaupUserArrowUpRight from '@/components/icons/vinaup-user-arrow-up-right.native';
import VinaupUserChecked from '@/components/icons/vinaup-user-checked.native';
import dayjs from 'dayjs';
import { prefetch } from 'fetchwire';
import { getBookingByIdApi } from '@/apis/booking/booking';
import { useRouter } from 'expo-router';
import { useNavigationStore } from '@/hooks/use-navigation-store';
import Feather from '@expo/vector-icons/Feather';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
interface BookingCardProps {
  booking?: ResponseWithMeta<BookingResponse, BookingMeta> | BookingResponse;
  isReceiver?: boolean;
}

export function BookingCard({ booking, isReceiver }: BookingCardProps) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const startDate = booking?.startDate
    ? dayjs(booking.startDate).format(DD_MM_DATE_FORMAT_SHORT)
    : '--';
  const endDate = booking?.endDate
    ? dayjs(booking.endDate).format('DD/MM/YY')
    : '--';
  const description = booking?.description || 'Booking mới';
  const senderName = booking?.organization?.name || '---';
  const receiverName = booking?.organizationCustomer?.name || 'Chưa xác định';
  const meta = booking && 'meta' in booking ? booking.meta : undefined;
  const isSenderSigned = meta?.isSenderSigned ?? false;
  const isReceiverSigned = meta?.isReceiverSigned ?? false;

  const navigateToDetail = async (bookingId: string) => {
    setIsNavigating(true);
    try {
      await prefetch(() => getBookingByIdApi(bookingId), {
        fetchKey: `organization-booking-${bookingId}`,
      });
    } catch {
      // Fallback to normal navigation if prefetch fails.
    }
    router.push({
      pathname: '/(protected)/booking-detail/[bookingId]',
      params: { bookingId },
    });
    setIsNavigating(false);
  };

  const handlePressPreview = (bookingId: string) => {
    router.push({
      pathname: '/(protected)/booking-detail/[bookingId]/booking-detail-preview',
      params: { bookingId },
    });
  };

  return (
    <Pressable onPress={() => booking && navigateToDetail(booking.id)}>
      <View style={styles.container}>
        <View
          style={[
            styles.innerCard,
            {
              backgroundColor: isReceiver
                ? COLORS.vinaupLightGreen
                : COLORS.vinaupSoftYellow,
            },
          ]}
        >
          <View style={styles.topSection}>
            <View style={styles.topRow}>
              <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                {description}
              </Text>
              <View style={styles.iconGroup}>
                <PressableOpacity
                  onPress={() => booking && handlePressPreview(booking.id)}
                >
                  <Feather name="eye" size={24} color={COLORS.vinaupTeal} />
                </PressableOpacity>
              </View>
            </View>
            <View style={styles.topRow}>
              <Text style={styles.dateText}>
                Từ {startDate} đến {endDate}
              </Text>
              <Text style={styles.codeText}>{booking?.code}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.bottomSection}>
            <View>
              <View style={styles.labelRow}>
                <VinaupUserArrowUpRight width={13} height={15} />
                <Text style={styles.label}>Gửi bởi</Text>
              </View>
              <View style={styles.valueRow}>
                <Text style={styles.senderText} numberOfLines={2}>
                  {senderName}
                </Text>
                {isSenderSigned && (
                  <Text style={styles.senderSignedText}>(đã ký)</Text>
                )}
              </View>
            </View>
            <View>
              <View style={[styles.labelRow, styles.receiverLabelRow]}>
                <Text style={styles.label}>Nhận bởi</Text>
                <VinaupUserChecked width={13} height={15} />
              </View>
              <View style={styles.valueRow}>
                <Text
                  style={[styles.receiverText, styles.receiverTextRight]}
                  numberOfLines={2}
                >
                  {receiverName}
                </Text>
                {isReceiverSigned && (
                  <Text
                    style={[styles.receiverSignedText, styles.receiverTextRight]}
                  >
                    (đã ký)
                  </Text>
                )}
              </View>
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valueRow: {},
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
  senderSignedText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.vinaupOrange,
  },
  receiverText: {
    fontSize: 16,
    color: COLORS.vinaupBlueDark,
  },
  receiverSignedText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.vinaupBlueDark,
  },
  receiverTextRight: {
    textAlign: 'right',
  },
});
