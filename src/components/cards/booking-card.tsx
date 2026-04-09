import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { BookingResponse } from '@/interfaces/booking-interfaces';
import dayjs from 'dayjs';
import { BookingStatusDisplay } from '@/constants/booking-constants';
import { useState } from 'react';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { PressableOpacity } from '../primitives/pressable-opacity';
import { useRouter } from 'expo-router';
import { prefetch } from 'fetchwire';
import { getBookingByIdApi } from '@/apis/booking-apis';
import { useNavigationStore } from '@/hooks/use-navigation-store';

interface BookingCardProps {
  booking?: BookingResponse;
}

export function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();
  const [isShowingPrice, setIsShowingPrice] = useState(false);

  const getDateRangeText = () => {
    if (!booking) return '';
    if (
      dayjs(booking.startDate).format('DD/MM') ===
      dayjs(booking.endDate).format('DD/MM')
    ) {
      return dayjs(booking.startDate).format('DD/MM');
    }
    return `${dayjs(booking.startDate).format('DD/MM')} - ${dayjs(
      booking.endDate
    ).format('DD/MM')}`;
  };

  const getBookingInfoText = () => {
    if (!booking) return '';
    if (booking.organizationCustomer) {
      return booking.organizationCustomer.name || '';
    }
    return '—';
  };

  const togglePrice = () => {
    setIsShowingPrice(!isShowingPrice);
  };

  const navigateToDetail = async (bookingId: string) => {
    setIsNavigating(true);
    try {
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
    } finally {
      setIsNavigating(false);
    }
  };

  if (!booking) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text>Không có dữ liệu</Text>
        </View>
      </View>
    );
  }

  const totalRemaining = calculateReceiptPaymentsSummary(
    booking.receiptPayments
  ).totalRemaining;

  return (
    <View style={styles.container}>
      <View style={styles.innerHeader}>
        <View style={styles.left}>
          <Text style={styles.dateRangeText}>{getDateRangeText()}</Text>
          <PressableOpacity onPress={togglePrice}>
            <Text
              style={[
                styles.equalSignText,
                isShowingPrice && styles.equalSignActive,
              ]}
            >
              =
            </Text>
          </PressableOpacity>
          {isShowingPrice && (
            <Text style={styles.bookingTotalAmountText}>
              {generateLocalePriceFormat(totalRemaining, 'vi-VN')}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          <Text style={styles.statusText}>
            {BookingStatusDisplay[booking.status]}
          </Text>
        </View>
      </View>
      <Pressable onPress={() => navigateToDetail(booking.id)}>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{booking.description}</Text>
            </View>
            <Text style={styles.codeText}>No. {booking.code.slice(0, 8)}</Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
              {getBookingInfoText()}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  innerHeader: {
    marginVertical: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  left: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  right: {},
  dateRangeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
  },
  equalSignText: {
    fontSize: 20,
    lineHeight: 20,
    paddingHorizontal: 4,
    borderRadius: 4,
    color: COLORS.vinaupTeal,
    backgroundColor: COLORS.vinaupWhite,
    overflow: 'hidden',
  },
  equalSignActive: {
    backgroundColor: 'transparent',
  },
  bookingTotalAmountText: {
    fontSize: 16,
    flexShrink: 0,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  codeText: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
    marginLeft: 8,
    flexShrink: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
  },
});
