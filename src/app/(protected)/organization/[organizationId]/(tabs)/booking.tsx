import { COLORS } from '@/constants/style-constant';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function OrganizationBookingScreen() {
  const { type } = useLocalSearchParams<{ organizationId: string; type: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === 'TO' ? 'Booking Nhận' : 'Booking Gửi'}
      </Text>
      <Text style={styles.subtitle}>type: {type || 'FROM'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: COLORS.vinaupTeal,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
    marginTop: 8,
  },
});
