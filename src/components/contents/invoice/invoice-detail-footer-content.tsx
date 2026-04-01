import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useRef } from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableCard } from '@/components/primitives/pressable-card';
import VinaupInfoNote from '@/components/icons/vinaup-info-note.native';
import { SimpleTextInputModal } from '../../modals/simple-text-input-modal/simple-text-input-modal';
import { InvoiceOrgCustomerSelectModal } from '@/components/modals/invoice-org-customer-select-modal/invoice-org-customer-select-modal';
import { Ionicons } from '@expo/vector-icons';
import { VinaupPenLine } from '@/components/icons/vinaup-pen-line.native';
import { useInvoiceDetailContext } from '@/providers/invoice-detail-provider';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';

export function InvoiceDetailFooterContent() {
  const { invoice, isUpdatingInvoice, isRefreshingInvoice, handleUpdateInvoice } =
    useInvoiceDetailContext();

  const isLoading = isUpdatingInvoice || isRefreshingInvoice;
  const organizationName = invoice?.organization?.name ?? '';
  const customerName = invoice?.organizationCustomer?.name ?? '';
  const note = invoice?.note ?? '';

  const noteModalRef = useRef<SlideSheetRef>(null);
  const selectCustomerModalRef = useRef<SlideSheetRef>(null);

  return (
    <>
      <Pressable
        style={styles.noteContainer}
        onPress={() => noteModalRef.current?.open()}
        disabled={isLoading}
      >
        <VinaupInfoNote width={22} height={22} color={COLORS.vinaupTeal} />
        <Text style={styles.noteValue} numberOfLines={2} ellipsizeMode="tail">
          {note || 'Ghi chú'}
        </Text>
        <VinaupPenLine width={16} height={16} color={COLORS.vinaupTeal} />
      </Pressable>

      <PressableCard
        style={{
          container: styles.cardContainer,
          card: styles.card,
        }}
        onPress={() => selectCustomerModalRef.current?.open()}
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
            </View>
          </View>
        </View>
      </PressableCard>

      <InvoiceOrgCustomerSelectModal modalRef={selectCustomerModalRef} />

      <SimpleTextInputModal
        value={note}
        isLoading={isLoading}
        modalRef={noteModalRef}
        onConfirm={(noteValue: string, onSuccessClose?: () => void) => {
          handleUpdateInvoice({ note: noteValue }, onSuccessClose);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
  },
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
