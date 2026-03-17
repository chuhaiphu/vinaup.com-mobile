import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableCard } from '@/components/primitives/pressable-card';
import VinaupPenLineVariant from '@/components/icons/vinaup-pen-line-variant.native';
import VinaupInfoNote from '@/components/icons/vinaup-info-note.native';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { SimpleTextInputModal } from '../../modals/simple-text-input-modal/simple-text-input-modal';
import { InvoiceOrgCustomerSelectModal } from '@/components/modals/invoice-org-customer-select-modal/invoice-org-customer-select-modal';
import { CreateOrganizationCustomerModal } from '@/components/modals/create-organization-customer-modal/create-organization-customer-modal';
import { Ionicons, Feather } from '@expo/vector-icons';

interface InvoiceDetailFooterContentProps {
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

export function InvoiceDetailFooterContent({
  invoice,
  organizationCustomers,
  onSelectCustomer,
  onNoteConfirm,
  isLoading = false,
}: InvoiceDetailFooterContentProps) {
  const organizationName = invoice?.organization?.name ?? '';
  const customerName =
    invoice?.organizationCustomer?.name ?? invoice?.externalCustomerName ?? '';
  const currentCustomerId = invoice?.externalCustomerName
    ? 'EXTERNAL'
    : (invoice?.organizationCustomer?.id ?? '');
  const note = invoice?.note ?? '';

  const noteModalRef = useRef<SlideSheetRef>(null);
  const selectCustomerModalRef = useRef<SlideSheetRef>(null);
  const createCustomerModalRef = useRef<SlideSheetRef>(null);

  const [localCustomers, setLocalCustomers] =
    useState<OrganizationCustomerResponse[]>(organizationCustomers);

  useEffect(() => {
    setLocalCustomers(organizationCustomers);
  }, [organizationCustomers]);

  const canEditCustomer = useMemo(
    () => Boolean(invoice?.organization?.id) && !isLoading,
    [invoice?.organization?.id, isLoading]
  );

  return (
    <>
      <Pressable
        style={styles.noteContainer}
        onPress={() => noteModalRef.current?.open()}
        disabled={isLoading}
      >
        <VinaupInfoNote width={22} height={22} color={COLORS.vinaupTeal} />
        <Text style={styles.noteValue} numberOfLines={2} ellipsizeMode="tail">
          {note || 'Ghi chú...'}
        </Text>
        <VinaupPenLineVariant width={16} height={16} color={COLORS.vinaupTeal} />
      </Pressable>

      <PressableCard
        style={{
          container: styles.cardContainer,
          card: styles.card,
        }}
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
              <Pressable
                style={styles.customerIconButton}
                onPress={() => createCustomerModalRef.current?.open()}
                disabled={!canEditCustomer}
                hitSlop={8}
              >
                <Feather
                  name="user-plus"
                  size={18}
                  color={
                    canEditCustomer ? COLORS.vinaupTeal : COLORS.vinaupMediumGray
                  }
                />
              </Pressable>
            </View>
            <View style={styles.customerRow}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.value, styles.valueRight, styles.customerValue]}
              >
                {customerName || ''}
              </Text>
              <Pressable
                style={styles.customerIconButton}
                onPress={() => selectCustomerModalRef.current?.open()}
                disabled={!canEditCustomer}
                hitSlop={8}
              >
                <Ionicons
                  name="search"
                  size={18}
                  color={
                    canEditCustomer ? COLORS.vinaupTeal : COLORS.vinaupMediumGray
                  }
                />
              </Pressable>
            </View>
          </View>
        </View>
      </PressableCard>

      <InvoiceOrgCustomerSelectModal
        organizationCustomers={localCustomers}
        currentCustomerId={currentCustomerId}
        isLoading={isLoading}
        modalRef={selectCustomerModalRef}
        onSelectCustomer={onSelectCustomer}
      />

      <CreateOrganizationCustomerModal
        organizationId={invoice?.organization?.id}
        modalRef={createCustomerModalRef}
        onCreated={(created) => {
          setLocalCustomers((prev) => [...prev, created]);
          onSelectCustomer?.('organization', created.id);
        }}
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
    alignItems: 'flex-start',
  },
  orgCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 6,
    gap: 4,
  },
  customerCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 4,
    paddingVertical: 6,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  customerIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    color: COLORS.vinaupMediumGray,
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
