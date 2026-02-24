import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';

export default function ReceiptPaymentProjectCompany() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thu chi dự án</Text>
      <Text style={styles.subtitle}>Đang phát triển...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.vinaupSoftGray,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.vinaupSoftGray,
  },
});
