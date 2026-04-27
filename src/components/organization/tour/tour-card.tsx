import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { COLORS } from '@/constants/style-constant';
import { TourResponse } from '@/interfaces/tour-interfaces';
import { TourStatusDisplay } from '@/constants/tour-constants';

interface TourCardProps {
  tour?: TourResponse;
}

export function TourCard({ tour }: TourCardProps) {
  const getTourInfoText = () => {
    if (!tour) return '';
    return `${tour.externalOrganizationName || tour.organization?.name || ''}`;
  };

  const getTourDateRangeText = () => {
    if (!tour) return '';
    if (
      dayjs(tour.startDate).format('DD/MM') ===
      dayjs(tour.endDate).format('DD/MM')
    ) {
      return dayjs(tour.startDate).format('DD/MM');
    }
    return `${dayjs(tour.startDate).format('DD/MM')} - ${dayjs(
      tour.endDate
    ).format('DD/MM')}`;
  };

  if (!tour) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text>Không có dữ liệu</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerHeader}>
        <View style={styles.left}>
          <Text style={styles.tourDateRangeText}>{getTourDateRangeText()}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.tourStatusText}>
            {TourStatusDisplay[tour.status]}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{tour.description}</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
            {getTourInfoText()}
          </Text>
        </View>
      </View>
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
  tourDateRangeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tourStatusText: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
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
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
  },
  descriptionContainer: {},
  descriptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
});

