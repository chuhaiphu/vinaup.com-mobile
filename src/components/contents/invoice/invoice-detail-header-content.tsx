import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableCard } from '@/components/primitives/pressable-card';
import { InvoiceInfoModal } from '@/components/modals/invoice-info-modal/invoice-info-modal';
import VinaupPenLineVariant from '../../icons/vinaup-pen-line-variant.native';

interface InvoiceDetailHeaderContentProps {
  invoice?: InvoiceResponse;
  isLoading?: boolean;
  onConfirm?: (
    data: {
      description: string;
      startDate: Date;
      endDate: Date;
      code?: string;
    },
    onSuccessCallback?: () => void
  ) => void;
}

export function InvoiceDetailHeaderContent({
  invoice,
  isLoading,
  onConfirm,
}: InvoiceDetailHeaderContentProps) {
  const modalRef = useRef<SlideSheetRef>(null);
  const [contentKey, setContentKey] = useState(0);

  if (!invoice) {
    return (
      <View>
        <Text>Không có dữ liệu</Text>
      </View>
    );
  }

  const handleOpen = () => {
    setContentKey((k) => k + 1);
    modalRef.current?.open();
  };

  const getDateRangeText = () => {
    const start = dayjs(invoice.startDate);
    const end = dayjs(invoice.endDate);

    if (start.isSame(end, 'day')) {
      return (
        <>
          <Text style={styles.dateText}>Ngày {start.format('DD/MM')} </Text>
          <Text style={styles.hourText}>({start.format('HH:mm')})</Text>
        </>
      );
    }
    return (
      <>
        <Text style={styles.dateText}>Từ {start.format('DD/MM')} </Text>
        <Text style={styles.hourText}>({start.format('HH:mm')})</Text>
        <Text style={styles.dateText}> đến {end.format('DD/MM')}</Text>
      </>
    );
  };

  return (
    <>
      <PressableCard
        onPress={handleOpen}
        style={{
          container: styles.cardContainer,
          card: styles.card,
        }}
      >
        <View style={styles.leftInfo}>
          <Text style={styles.entityName}>Tên: {invoice.description}</Text>
          <View style={styles.dateRow}>{getDateRangeText()}</View>
        </View>
        <View style={styles.rightInfo}>
          <View style={styles.editButton}>
            <VinaupPenLineVariant width={16} height={16} />
          </View>
          <Text style={styles.entityCode}>No. {invoice.code.slice(0, 8)}</Text>
        </View>
      </PressableCard>
      <InvoiceInfoModal
        invoice={invoice}
        isLoading={isLoading}
        contentKey={contentKey}
        modalRef={modalRef}
        onConfirm={onConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {},
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  leftInfo: {
    flex: 1,
    gap: 8,
  },
  rightInfo: {
    alignItems: 'flex-end',
    gap: 8,
  },
  entityName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupBlack,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateText: {
    color: COLORS.vinaupMediumDarkGray,
    fontSize: 16,
  },
  hourText: {
    color: COLORS.vinaupMediumGray,
    fontSize: 16,
  },
  editButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: COLORS.vinaupYellow,
  },
  entityCode: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
  },
});
