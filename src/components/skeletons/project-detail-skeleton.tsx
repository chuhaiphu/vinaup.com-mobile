import { Skeleton } from '@/components/primitives/skeleton';
import { StyleSheet, View } from 'react-native';
import { EntityCardSkeleton } from './entity-card-skeleton';

export function ProjectDetailSkeleton() {
  return (
    <View style={styles.container}>
      {/* Status filter row */}
      <View style={styles.filterRow}>
        <Skeleton style={styles.skeletonStatusIcon} borderRadius={4} />
        <View style={styles.filterGap} />
        <Skeleton style={styles.skeletonStatusText} borderRadius={4} />
      </View>

      {/* Header card skeleton */}
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <Skeleton style={styles.skeletonName} borderRadius={4} />
          <View style={styles.dateRow}>
            <Skeleton style={styles.skeletonDate} borderRadius={4} />
          </View>
        </View>
        <View style={styles.headerRight}>
          <Skeleton style={styles.skeletonEditButton} borderRadius={50} />
        </View>
      </View>

      {/* Receipt payment list skeleton */}
      <View style={styles.list}>
        <EntityCardSkeleton withHeader />
        <View style={styles.separator} />
        <EntityCardSkeleton withHeader />
        <View style={styles.separator} />
        <EntityCardSkeleton withHeader />
      </View>

      {/* Footer skeleton */}
      <View style={styles.noteRow}>
        <Skeleton style={styles.skeletonNoteIcon} borderRadius={4} />
        <Skeleton style={styles.skeletonNoteText} borderRadius={4} />
        <Skeleton style={styles.skeletonPenIcon} borderRadius={4} />
      </View>

      <View style={styles.footerCard}>
        <View style={styles.footerCol}>
          <Skeleton style={styles.skeletonLabel} borderRadius={4} />
          <View style={styles.footerColGap} />
          <Skeleton style={styles.skeletonValue} borderRadius={4} />
        </View>
        <View style={styles.footerCol}>
          <Skeleton style={styles.skeletonLabel} borderRadius={4} />
          <View style={styles.footerColGap} />
          <Skeleton style={styles.skeletonValue} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Status filter
  filterRow: {
    marginVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonStatusIcon: {
    width: 18,
    height: 18,
  },
  filterGap: {
    width: 6,
  },
  skeletonStatusText: {
    width: 80,
    height: 18,
  },

  // Header card
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  headerLeft: {
    flex: 1,
    gap: 8,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  skeletonName: {
    width: '70%',
    height: 22,
  },
  dateRow: {
    flexDirection: 'row',
  },
  skeletonDate: {
    width: 140,
    height: 18,
  },
  skeletonEditButton: {
    width: 28,
    height: 28,
  },

  // List
  list: {
    flex: 1,
    marginTop: 8,
  },
  separator: {
    height: 2,
  },

  // Note row
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 8,
  },
  skeletonNoteIcon: {
    width: 22,
    height: 22,
  },
  skeletonNoteText: {
    flex: 1,
    height: 18,
  },
  skeletonPenIcon: {
    width: 16,
    height: 16,
  },

  // Footer card
  footerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  footerCol: {
    flex: 1,
    gap: 4,
  },
  footerColGap: {
    height: 4,
  },
  skeletonLabel: {
    width: 60,
    height: 16,
  },
  skeletonValue: {
    width: '80%',
    height: 18,
  },
});
