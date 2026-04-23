import { Skeleton } from '@/components/primitives/skeleton';
import { COLORS } from '@/constants/style-constant';
import { StyleSheet, View } from 'react-native';

export function BookingCardSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.innerCard}>
        <View style={styles.topSection}>
          <Skeleton style={styles.skeletonTitle} borderRadius={4} />
          <View style={styles.topRowSecond}>
            <Skeleton style={styles.skeletonDate} borderRadius={4} />
            <Skeleton style={styles.skeletonCode} borderRadius={4} />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.bottomSection}>
          <Skeleton style={styles.skeletonSender} borderRadius={4} />
          <Skeleton style={styles.skeletonReceiver} borderRadius={4} />
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
  innerCard: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.vinaupWhite,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  topSection: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 8,
  },
  skeletonTitle: {
    height: 20,
    width: '60%',
  },
  topRowSecond: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonDate: {
    height: 16,
    width: '45%',
  },
  skeletonCode: {
    height: 16,
    width: '25%',
  },
  divider: {
    height: 1,
    marginHorizontal: 8,
  },
  bottomSection: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonSender: {
    height: 36,
    width: '40%',
  },
  skeletonReceiver: {
    height: 36,
    width: '40%',
  },
});
