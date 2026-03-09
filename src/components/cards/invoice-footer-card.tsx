import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useRef } from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { InvoiceOrgCustomerEditModal } from '@/components/modals/invoice-org-customer-edit-modal/invoice-org-customer-edit-modal';
import VinaupPenLineVariant from '@/components/icons/vinaup-pen-line-variant.native';
import VinaupInfoNote from '@/components/icons/vinaup-info-note.native';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { SimpleTextInputModal } from '../modals/simple-text-input-modal/simple-text-input-modal';

interface InvoiceFooterCardProps {
  invoice?: InvoiceResponse;
  organizationCustomers: OrganizationCustomerResponse[];
  onSelectCustomer?: (
    type: 'external' | 'organization',
    customerId?: string,
    onSuccessCallback?: () => void
  ) => void;
  onNoteConfirm?: (note: string, onSuccessCallback?: () => void) => void;
  isLoading?: boolean;
}

export function InvoiceFooterCard({
  invoice,
  organizationCustomers,
  onSelectCustomer,
  onNoteConfirm,
  isLoading = false,
}: InvoiceFooterCardProps) {
  const organizationName = invoice?.organization?.name ?? '';
  const customerName =
    invoice?.organizationCustomer?.name ?? invoice?.externalCustomerName ?? '';
  const currentCustomerId = invoice?.externalCustomerName
    ? 'external'
    : (invoice?.organizationCustomer?.id ?? '');
  const note = invoice?.note ?? '';

  const orgModalRef = useRef<SlideSheetRef>(null);
  const noteModalRef = useRef<SlideSheetRef>(null);

  return (
    <>
      <Pressable
        style={styles.noteContainer}
        onPress={() => noteModalRef.current?.open()}
        disabled={isLoading}
      >
        <VinaupInfoNote width={20} height={20} color={COLORS.vinaupTeal} />
        <Text style={styles.noteValue} numberOfLines={2} ellipsizeMode="tail">
          {note || '—'}
        </Text>
        <VinaupPenLineVariant width={16} height={16} color={COLORS.vinaupTeal} />
      </Pressable>

      <Pressable
        style={styles.container}
        onPress={() => orgModalRef.current?.open()}
        disabled={isLoading}
      >
        <View style={styles.card}>
          <View style={styles.rowsNew}>
            <View style={styles.orgCol}>
              <Text style={styles.label}>Tổ chức:</Text>
              <Text style={[styles.value, styles.valueLeft]}>
                {organizationName || ''}
              </Text>
            </View>
            <View style={styles.customerCol}>
              <Text style={styles.label}>Khách hàng:</Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.value, styles.valueRight]}
              >
                {customerName || ''}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      <InvoiceOrgCustomerEditModal
        organizationId={invoice?.organization?.id}
        organizationName={organizationName}
        organizationCustomers={organizationCustomers}
        currentCustomerId={currentCustomerId}
        isLoading={isLoading}
        modalRef={orgModalRef}
        onSelectCustomer={onSelectCustomer}
      />

      <SimpleTextInputModal
        value={note}
        isLoading={isLoading}
        modalRef={noteModalRef}
        onConfirm={(noteValue: string, onSuccessClose?: () => void) => {
          onNoteConfirm?.(noteValue, onSuccessClose);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupMediumGray,
  },
  rowsNew: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orgCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  customerCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupTeal,
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
