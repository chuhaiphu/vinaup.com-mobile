import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { BookingResponse } from '@/interfaces/booking-interfaces';
import { SimpleLineIcons } from '@expo/vector-icons';
import VinaupUserArrowUpRight from '@/components/icons/vinaup-user-arrow-up-right.native';
import { VinaupPenLine } from '@/components/icons/vinaup-pen-line.native';
import VinaupUserChecked from '@/components/icons/vinaup-user-checked.native';

interface BookingCardProps {
  booking?: BookingResponse;
}

export function BookingCard({ booking: _booking }: BookingCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.dateHeader}>Từ 20/03 đến 23/03/26</Text>

      <View style={styles.innerCard}>
        <View style={styles.topSection}>
          <View style={styles.topRow1}>
            <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
              Tên Booking hotel Hồng Hà
            </Text>
            <View style={styles.iconGroup}>
              <VinaupPenLine width={16} height={16} color={COLORS.vinaupTeal} />
              <SimpleLineIcons name="eye" size={24} color={COLORS.vinaupTeal} />
            </View>
          </View>

          <View style={styles.topRow2}>
            <VinaupUserArrowUpRight width={14} height={16} />
            <Text style={styles.senderText}>Gửi: Nguyễn Văn Tèo Em</Text>
          </View>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <View style={styles.left}>
            <Text style={styles.bottomLabel}>Booking nhận bởi:</Text>
            <Text style={styles.bottomValue}>Hotel Hồng Hà 7</Text>
          </View>

          <View style={styles.bottomDivider} />

          <View style={styles.right}>
            <View style={styles.topRightRow}>
              <Text style={styles.statusLabel}>Trạng thái</Text>
            </View>
            <View style={styles.bottomRightRow}>
              <Text style={[styles.statusText, { color: COLORS.vinaupOrange }]}>
                Chờ ký
              </Text>
              <Text style={styles.statusText}> bởi </Text>
              <VinaupUserChecked width={13} height={15} />
              <Text style={styles.statusText}> nhận</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateHeader: {
    fontSize: 16,
    marginVertical: 8,
  },
  innerCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    overflow: 'hidden',
  },

  // Top section
  topSection: {
    backgroundColor: COLORS.vinaupWhite,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  topRow1: {
    flexDirection: 'row',
    alignItems: 'center',
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
  topRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  senderText: {
    fontSize: 15,
  },
  bottomSection: {
    backgroundColor: COLORS.vinaupSoftGray,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  left: {
    flex: 1,
    gap: 2,
  },
  right: {
    flex: 1,
    gap: 2,
  },
  bottomDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: COLORS.vinaupLightGray,
    marginHorizontal: 10,
  },
  bottomLabel: {
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
  },
  bottomValue: {
    fontSize: 16,
    color: COLORS.vinaupBlack,
  },
  topRightRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
  },
  statusText: {
    fontSize: 16,
  },
  waitingSignText: {
    fontSize: 16,
    color: COLORS.vinaupOrange,
  },
  bottomRightRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 2,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.vinaupTeal,
  },
});
