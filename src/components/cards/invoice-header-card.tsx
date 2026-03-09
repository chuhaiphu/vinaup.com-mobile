import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { InvoiceInfoContent } from '@/components/modals/invoice-info-modal';
import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import VinaupPenLineVariant from '../icons/vinaup-pen-line-variant.native';

interface InvoiceHeaderCardProps {
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

export function InvoiceHeaderCard({
  invoice,
  isLoading,
  onConfirm,
}: InvoiceHeaderCardProps) {
  const modalRef = useRef<SlideSheetRef>(null);
  const [contentKey, setContentKey] = useState(0);

  if (!invoice) {
    return (
      <View style={styles.container}>
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
      <Pressable style={styles.container} onPress={handleOpen}>
        <View style={styles.mainInfo}>
          <View style={styles.leftInfo}>
            <Text style={styles.entityName}>Tên: {invoice.description}</Text>
            <View style={styles.dateRow}>{getDateRangeText()}</View>
          </View>
          <View style={styles.rightInfo}>
            <View style={styles.editButton}>
              <VinaupPenLineVariant width={18} height={18} />
            </View>
            <Text style={styles.entityCode}>No. {invoice.code.slice(0, 8)}</Text>
          </View>
        </View>
      </Pressable>

      <SlideSheet ref={modalRef}>
        <InvoiceInfoContent
          key={contentKey}
          invCode={invoice.code}
          invDescription={invoice.description}
          invStartDate={invoice.startDate}
          isLoading={isLoading}
          onCloseRequest={() => modalRef.current?.close()}
          onConfirm={(data) => {
            onConfirm?.(data, () => modalRef.current?.close());
          }}
        />
      </SlideSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupMediumGray,
  },
  leftInfo: {
    flex: 1,
    gap: 4,
  },
  rightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
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
    padding: 2,
    borderRadius: 4,
  },
  entityCode: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
  },
});
