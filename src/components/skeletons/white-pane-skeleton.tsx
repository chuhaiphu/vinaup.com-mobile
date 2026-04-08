import { Skeleton } from '@/components/primitives/skeleton';
import { StyleSheet, View } from 'react-native';

interface WhitePaneSkeletonProps {
  height: number;
}

export function WhitePaneSkeleton({ height }: WhitePaneSkeletonProps) {
  return (
    <View style={styles.pane}>
      <Skeleton style={{ height: height }} borderRadius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  pane: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
  },
});
