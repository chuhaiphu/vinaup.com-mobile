import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useState } from 'react';
import { ProjectOrgCustomerEditModal } from '@/components/modals/project-org-customer-edit-modal';
import { SimpleTextInputModal } from '@/components/modals/simple-text-input-modal';
import VinaupPenLineVariant from '@/components/icons/vinaup-pen-line-variant.native';
import VinaupInfoNote from '@/components/icons/vinaup-info-note.native';

interface ProjectFooterCardProps {
  organizationName?: string | null;
  customerName?: string | null;
  note?: string | null;
  onOrgCusConfirm?: (organizationName: string, customerName: string) => void;
  onNoteConfirm?: (note: string, onSuccessCallback?: () => void) => void;
  isLoading?: boolean;
}

export function ProjectFooterCard({
  organizationName = '',
  customerName = '',
  note = '',
  onOrgCusConfirm,
  onNoteConfirm,
  isLoading = false,
}: ProjectFooterCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  return (
    <>
      <Pressable
        style={styles.noteContainer}
        onPress={() => setNoteModalVisible(true)}
        disabled={isLoading}
      >
        <VinaupInfoNote width={18} height={18} color={COLORS.vinaupMediumGray} />
        <Text style={styles.noteLabel}>Ghi chú:</Text>
        <Text style={styles.noteValue}>{note || '—'}</Text>
        <VinaupPenLineVariant width={16} height={16} color={COLORS.vinaupTeal} />
      </Pressable>

      <Pressable
        style={styles.container}
        onPress={() => setModalVisible(true)}
        disabled={isLoading}
      >
        <View style={styles.card}>
          <View style={styles.rows}>
            <View style={styles.row}>
              <Text style={styles.label}>Tổ chức:</Text>
              <Text style={styles.value}>{organizationName || ''}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tên khách:</Text>
              <Text style={styles.value}>{customerName || ''}</Text>
            </View>
          </View>
          <View style={styles.editButton}>
            <VinaupPenLineVariant
              width={18}
              height={18}
              color={COLORS.vinaupTeal}
            />
          </View>
        </View>
      </Pressable>

      <ProjectOrgCustomerEditModal
        visible={modalVisible}
        organizationName={organizationName}
        customerName={customerName}
        isLoading={isLoading}
        onConfirm={onOrgCusConfirm}
        onClose={() => setModalVisible(false)}
      />

      <SimpleTextInputModal
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
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupMediumGray,
  },
  rows: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupBlack,
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  noteValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupBlack,
  },
  editButton: {
    padding: 6,
  },
});
