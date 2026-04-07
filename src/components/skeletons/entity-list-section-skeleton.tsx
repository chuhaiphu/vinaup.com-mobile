import { StyleSheet, View } from 'react-native';
import { EntityCardSkeleton } from './entity-card-skeleton';

export function EntityListSectionSkeleton() {
  return (
    <View style={styles.container}>
      <EntityCardSkeleton withHeader />
      <View style={styles.separator} />
      <EntityCardSkeleton withHeader />
      <View style={styles.separator} />
      <EntityCardSkeleton withHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 2,
  },
});
