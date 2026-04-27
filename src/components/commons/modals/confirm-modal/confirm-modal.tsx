import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';
import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  headerTitle: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  visible,
  headerTitle,
  confirmText = 'Xác nhận',
  cancelText = 'Huỷ',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Feather name="x" size={20} color={COLORS.vinaupMediumDarkGray} />
            </Pressable>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </Button>
            <Button
              style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
              onPress={onConfirm}
              disabled={isLoading}
              isLoading={isLoading}
              loaderStyle={{ color: COLORS.vinaupWhite }}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 12,
    backgroundColor: COLORS.vinaupWhite,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.vinaupBlack,
    marginRight: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupTeal,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: COLORS.vinaupTeal,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupWhite,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
