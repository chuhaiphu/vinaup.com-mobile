import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function TourCalculationScreen() {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  return (
    <View>
      <Text>Tính giá tour</Text>
    </View>
  );
}
