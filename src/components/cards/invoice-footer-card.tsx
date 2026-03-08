import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useState } from 'react';
import { ProjectOrgCustomerEditModal } from '@/components/modals/project-org-customer-edit-modal';
import { SimpleTextInputModal } from '@/components/modals/simple-text-input-modal';
import VinaupPenLineVariant from '@/components/icons/vinaup-pen-line-variant.native';
import VinaupInfoNote from '@/components/icons/vinaup-info-note.native';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';

interface InvoiceFooterCardProps {
  invoice?: InvoiceResponse;
  onOrgCusConfirm?: (
    organizationName: string,
    customerName: string,
    onSuccessCallback?: () => void
  ) => void;
  onNoteConfirm?: (note: string, onSuccessCallback?: () => void) => void;
  isLoading?: boolean;
}

export function InvoiceFooterCard({
  invoice,
  onOrgCusConfirm,
  onNoteConfirm,
  isLoading = false,
}: InvoiceFooterCardProps) {
  const organizationName = invoice?.externalOrganizationName ?? '';
  const customerName = invoice?.externalCustomerName ?? '';
  const note = invoice?.note ?? '';
  const [modalVisible, setModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);

  return (
    <>
      <Pressable
        style={styles.noteContainer}
        onPress={() => setNoteModalVisible(true)}
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
        onPress={() => setModalVisible(true)}
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
              <Text style={styles.label}>Tên khách:</Text>
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

      <ProjectOrgCustomerEditModal
        key={`invoice-org-customer-modal-${invoice?.id}`}
        visible={modalVisible}
        organizationName={organizationName}
        customerName={customerName}
        isLoading={isLoading}
        onConfirm={(orgName, cusName) =>
          onOrgCusConfirm?.(orgName, cusName, () => setModalVisible(false))
        }
        onClose={() => setModalVisible(false)}
      />

      <SimpleTextInputModal
        key={`invoice-note-modal-${invoice?.id}`}
        visible={noteModalVisible}
        value={note}
        isLoading={isLoading}
        onConfirm={(noteValue) =>
          onNoteConfirm?.(noteValue, () => setNoteModalVisible(false))
        }
        onClose={() => setNoteModalVisible(false)}
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
