import { EntityListSectionSkeleton } from '@/components/commons/skeletons/entity-list-section-skeleton';
import { COLORS } from '@/constants/style-constant';
import React, { Suspense, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import dayjs from 'dayjs';
import { FontAwesome5 } from '@expo/vector-icons';
import { ReceiptPaymentListSectionContent } from '@/components/personal/receipt-payment/list/receipt-payment-list-section-content';

export default function PersonalReceiptPaymentScreen() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const suspenseKey = selectedDate.format('YYYY-MM-DD');

  return (
    <View style={styles.container}>
      <View style={styles.dateTimePickerContainer}>
        <DateTimePicker
          leftSection={
            <FontAwesome5 name="calendar-alt" size={18} color={COLORS.vinaupTeal} />
          }
          value={selectedDate}
          onChange={setSelectedDate}
          displayFormat="DD/MM"
          style={{ dateText: styles.dateText }}
        />
      </View>
      <Suspense fallback={<EntityListSectionSkeleton />}>
        <ReceiptPaymentListSectionContent
          key={suspenseKey}
          selectedDate={selectedDate}
        />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateTimePickerContainer: {
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
});
