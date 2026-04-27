import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { TourResponse } from '@/interfaces/tour-interfaces';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableCard } from '@/components/primitives/pressable-card';
import { TourInfoModal } from '@/components/organization/tour/modals/tour-info-modal/tour-info-modal';
import VinaupPenLineVariant from '@/components/icons/vinaup-pen-line-variant.native';

interface TourDetailHeaderContentProps {
  tour?: TourResponse;
  isLoading?: boolean;
  onConfirm?: (
    data: {
      description: string;
      startDate: string;
      endDate: string;
    },
    onSuccessCallback?: () => void
  ) => void;
}

export function TourDetailHeaderContent({
  tour,
  isLoading,
  onConfirm,
}: TourDetailHeaderContentProps) {
  const modalRef = useRef<SlideSheetRef>(null);

  const handleOpen = () => {
    modalRef.current?.open();
  };

  const getDateRangeText = () => {
    const start = dayjs(tour?.startDate);
    const end = dayjs(tour?.endDate);

    if (start.isSame(end, 'day')) {
      return (
        <>
          <Text style={styles.dateText}>Ngày {start.format('DD/MM/YY')} </Text>
          <Text style={styles.hourText}>({start.format('HH:mm')})</Text>
        </>
      );
    }
    return (
      <>
        <Text style={styles.dateText}>Từ {start.format('DD/MM')} </Text>
        <Text style={styles.hourText}>({start.format('HH:mm')})</Text>
        <Text style={styles.dateText}> đến {end.format('DD/MM/YY')}</Text>
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
          <Text style={styles.entityName}>Tên: {tour?.description}</Text>
          <View style={styles.dateRow}>{getDateRangeText()}</View>
        </View>
        <View style={styles.rightInfo}>
          <View style={styles.editButton}>
            <VinaupPenLineVariant width={14} height={14} />
          </View>
          <Text style={styles.entityCode}>No. {tour?.code.slice(0, 8)}</Text>
        </View>
      </PressableCard>
      {tour && (
        <TourInfoModal
          tour={tour}
          isLoading={isLoading}
          modalRef={modalRef}
          onConfirm={onConfirm}
        />
      )}
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
    fontSize: 15,
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
    fontSize: 15,
    color: COLORS.vinaupMediumDarkGray,
  },
});
