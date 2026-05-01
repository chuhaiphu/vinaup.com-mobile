import { DATE_FORMAT_SHORT } from '@/constants/app-constant';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableCard } from '@/components/primitives/pressable-card';
import { InvoiceInfoModal } from '@/components/organization/invoice/modals/invoice-info-modal/invoice-info-modal';
import VinaupPenLineVariant from '@/components/icons/vinaup-pen-line-variant.native';
import { useInvoiceDetailContext } from '@/providers/invoice-detail-provider';

export function InvoiceDetailHeaderContent() {
  const { invoice, isUpdatingInvoice, isRefreshingInvoice, handleUpdateInvoice } =
    useInvoiceDetailContext();
  const modalRef = useRef<SlideSheetRef>(null);

  if (!invoice) {
    return (
      <View>
        <Text>Không có dữ liệu</Text>
      </View>
    );
  }

  const handleOpen = () => {
    modalRef.current?.open();
  };

  const getDateRangeText = () => {
    const start = dayjs(invoice.startDate);
    const end = dayjs(invoice.endDate);

    if (start.isSame(end, 'day')) {
      return (
        <>
          <Text style={styles.dateText}>Ngày {start.format(DATE_FORMAT_SHORT)} </Text>
          <Text style={styles.hourText}>({start.format('HH:mm')})</Text>
        </>
      );
    }
    return (
      <>
        <Text style={styles.dateText}>Từ {start.format(DATE_FORMAT_SHORT)} </Text>
        <Text style={styles.hourText}>({start.format('HH:mm')})</Text>
        <Text style={styles.dateText}> đến {end.format(DATE_FORMAT_SHORT)}</Text>
        <Text style={styles.hourText}> ({end.format('HH:mm')})</Text>
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
          <Text style={styles.entityCode}>No. {invoice.code}</Text>
        </View>
      </PressableCard>
      <InvoiceInfoModal
        invoice={invoice}
        isLoading={isUpdatingInvoice || isRefreshingInvoice}
        modalRef={modalRef}
        onConfirm={handleUpdateInvoice}
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
