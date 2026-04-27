import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';
import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface PdfPageSizeModalProps {
  visible: boolean;
  isLoading?: boolean;
  onSelectA4: () => void;
  onSelectA5: () => void;
  onClose: () => void;
}

export function PdfPageSizeModal({
  visible,
  isLoading = false,
  onSelectA4,
  onSelectA5,
  onClose,
}: PdfPageSizeModalProps) {
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
            <Text style={styles.headerTitle}>Chọn khổ giấy PDF</Text>
            <Pressable onPress={onClose} hitSlop={8} disabled={isLoading}>
              <Feather name="x" size={20} color={COLORS.vinaupMediumDarkGray} />
            </Pressable>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              style={[styles.optionButton, isLoading && styles.buttonDisabled]}
              onPress={onSelectA4}
              disabled={isLoading}
            >
              <Text style={styles.optionButtonText}>A4</Text>
            </Button>
            <Button
              style={[styles.optionButton, isLoading && styles.buttonDisabled]}
              onPress={onSelectA5}
              disabled={isLoading}
            >
              <Text style={styles.optionButtonText}>A5</Text>
            </Button>
            <Button
              style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Huỷ</Text>
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
    gap: 12,
  },
  optionButton: {
    borderRadius: 8,
    backgroundColor: COLORS.vinaupTeal,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupWhite,
  },
  cancelButton: {
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
  buttonDisabled: {
    opacity: 0.6,
  },
});
