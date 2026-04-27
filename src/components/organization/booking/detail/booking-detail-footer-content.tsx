import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useRef } from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableCard } from '@/components/primitives/pressable-card';
import VinaupInfoNote from '@/components/icons/vinaup-info-note.native';
import { SimpleTextInputModal } from '@/components/commons/modals/simple-text-input-modal/simple-text-input-modal';
import { Ionicons } from '@expo/vector-icons';
import { VinaupPenLine } from '@/components/icons/vinaup-pen-line.native';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { BookingOrgCustomerSelectModal } from '@/components/organization/booking/modals/booking-org-customer-select-modal/booking-org-customer-select-modal';
import { useBookingDetailContext } from '@/providers/booking-detail-provider';

export function BookingDetailFooterContent() {
  const {
    booking,
    canEdit,
    isUpdatingBooking,
    isRefreshingBooking,
    handleUpdateBooking,
  } = useBookingDetailContext();

  const isLoading = isUpdatingBooking || isRefreshingBooking;
  const organizationName = booking?.organization?.name ?? '';
  const customerName = booking?.organizationCustomer?.name ?? '';
  const note = booking?.note ?? '';

  const noteModalRef = useRef<SlideSheetRef>(null);
  const selectCustomerModalRef = useRef<SlideSheetRef>(null);

  return (
    <>
      <Pressable
        style={styles.noteContainer}
        onPress={canEdit ? () => noteModalRef.current?.open() : undefined}
        disabled={isLoading || !canEdit}
      >
        <VinaupInfoNote width={22} height={22} color={COLORS.vinaupTeal} />
        <Text style={styles.noteValue} numberOfLines={2} ellipsizeMode="tail">
          {note || 'Ghi chú'}
        </Text>
        {canEdit && (
          <VinaupPenLine width={16} height={16} color={COLORS.vinaupTeal} />
        )}
      </Pressable>

      <PressableCard
        style={{
          container: styles.cardContainer,
          card: styles.card,
        }}
        onPress={canEdit ? () => selectCustomerModalRef.current?.open() : undefined}
      >
        <View style={styles.rowsNew}>
          <View style={styles.orgCol}>
            <Text style={styles.label}>Tổ chức:</Text>
            <Text style={[styles.value, styles.valueLeft]}>
              {organizationName || ''}
            </Text>
          </View>
          <View style={styles.customerCol}>
            <View style={styles.customerRow}>
              <Text style={styles.label}>Khách hàng:</Text>
            </View>
            <View style={styles.customerRow}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.value, styles.valueRight, styles.customerValue]}
              >
                {customerName || ''}
              </Text>
              {canEdit && (
                <PressableOpacity
                  style={styles.searchCustomerButton}
                  onPress={() => selectCustomerModalRef.current?.open()}
                  disabled={isLoading}
                  hitSlop={8}
                >
                  <Ionicons
                    name="search"
                    size={18}
                    color={!isLoading ? COLORS.vinaupTeal : COLORS.vinaupMediumGray}
                  />
                </PressableOpacity>
              )}
            </View>
          </View>
        </View>
      </PressableCard>

      {canEdit && (
        <BookingOrgCustomerSelectModal modalRef={selectCustomerModalRef} />
      )}

      {canEdit && (
        <SimpleTextInputModal
          value={note}
          isLoading={isLoading}
          modalRef={noteModalRef}
          onConfirm={(noteValue: string, onSuccessClose?: () => void) => {
            handleUpdateBooking({ note: noteValue }, onSuccessClose);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {},
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  rowsNew: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  orgCol: {
    gap: 4,
  },
  customerCol: {
    flex: 1,
    gap: 4,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  searchCustomerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.vinaupYellow,
    borderRadius: 12,
    width: 26,
    height: 26,
  },
  label: {
    fontSize: 16,
    color: COLORS.vinaupMediumDarkGray,
  },
  valueLeft: {
    textAlign: 'left',
  },
  valueRight: {
    textAlign: 'right',
  },
  value: {
    fontSize: 16,
    color: COLORS.vinaupBlack,
    marginTop: 2,
  },
  customerValue: {
    flexShrink: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 4,
  },
  noteValue: {
    flex: 1,
    fontSize: 16,
    color: COLORS.vinaupBlack,
  },
});
