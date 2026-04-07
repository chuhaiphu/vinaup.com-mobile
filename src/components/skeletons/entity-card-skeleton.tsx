import { Skeleton } from '@/components/primitives/skeleton';
import { StyleSheet, View } from 'react-native';

interface EntityCardSkeletonProps {
  withHeader?: boolean;
}

export function EntityCardSkeleton({ withHeader = false }: EntityCardSkeletonProps) {
  return (
    <View style={styles.container}>
      {withHeader && (
        <View style={styles.innerHeader}>
          <Skeleton style={styles.skeletonDateRange} borderRadius={4} />
          <Skeleton style={styles.skeletonStatus} borderRadius={4} />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Skeleton style={styles.skeletonDescription} borderRadius={4} />
        </View>
        <View style={styles.bottomRow}>
          <Skeleton style={styles.skeletonPrice} borderRadius={4} />
          <View style={styles.gap} />
          <Skeleton style={styles.skeletonQuantity} borderRadius={4} />
          <View style={styles.gap} />
          <Skeleton style={styles.skeletonPrice} borderRadius={4} />
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
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonDateRange: {
    width: 80,
    height: 18,
  },
  skeletonStatus: {
    width: 60,
    height: 16,
  },
  content: {
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  topRow: {
    flexDirection: 'row',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gap: {
    width: 8,
  },
  skeletonDescription: {
    flex: 1,
    height: 24,
  },
  skeletonPrice: {
    flex: 1,
    height: 24,
  },
  skeletonQuantity: {
    flex: 0.75,
    height: 24,
  },
});
