import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { Feather } from '@expo/vector-icons';
import VinaupCalendarIcon from '@/components/icons/vinaup-calendar-icon';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { calculateReceiptPaymentsSummary } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { useRouter } from 'expo-router';

interface PersonalHomeIndexSummaryProps {
  receiptPayments?: ReceiptPaymentResponse[] | null;
}

export function PersonalHomeIndexSummary({
  receiptPayments,
}: PersonalHomeIndexSummaryProps) {
  const summary = calculateReceiptPaymentsSummary(receiptPayments);
  const router = useRouter();

  const handlePressSchedule = () => {
    router.push('/(protected)/personal/(tabs)/project' as never);
  };

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        <Text style={styles.label}>Tiền công</Text>
        <Text style={styles.value}>
          {generateLocalePriceFormat(summary.totalRemaining)}
        </Text>
      </View>

      <PressableOpacity style={styles.banner} onPress={handlePressSchedule}>
        <View style={styles.bannerLeft}>
          <VinaupCalendarIcon width={22} height={22} color={COLORS.vinaupTeal} />
          <Text style={styles.bannerText}>Lịch tiền công tháng này của bạn</Text>
        </View>
        <Feather name="chevron-right" size={22} color={COLORS.vinaupTeal} />
      </PressableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    backgroundColor: COLORS.vinaupWhite,
    borderRadius: 10,
    padding: 8,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.vinaupTeal,
  },
  value: {
    fontSize: 24,
    color: COLORS.vinaupBlack,
  },
  banner: {
    backgroundColor: COLORS.vinaupLightYellow,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bannerText: {
    fontSize: 17,
    color: COLORS.vinaupTeal,
  },
});
