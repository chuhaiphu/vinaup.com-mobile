import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/primitives/button';

interface ProjectOrgCustomerEditModalProps {
  visible: boolean;
  organizationName?: string | null;
  customerName?: string | null;
  isLoading?: boolean;
  onConfirm?: (organizationName: string, customerName: string) => void;
  onClose?: () => void;
}

export function ProjectOrgCustomerEditModal({
  visible,
  organizationName = '',
  customerName = '',
  isLoading = false,
  onConfirm,
  onClose,
}: ProjectOrgCustomerEditModalProps) {
  const [tempOrgName, setTempOrgName] = useState(organizationName || '');
  const [tempCustomerName, setTempCustomerName] = useState(customerName || '');

  const orgInputRef = useRef<TextInput>(null);
  const customerInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setTempOrgName(organizationName || '');
      setTempCustomerName(customerName || '');
    }
  }, [visible, organizationName, customerName]);

  const handleConfirm = () => {
    if (!tempOrgName.trim() || !tempCustomerName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    onConfirm?.(tempOrgName, tempCustomerName);
    onClose?.();
  };

  const handleOrgInputSubmit = () => {
    customerInputRef.current?.focus();
  };

  const handleCustomerInputSubmit = () => {
    handleConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}
      animationType="fade"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tổ chức</Text>
            <TextInput
              ref={orgInputRef}
              style={styles.input}
              placeholder="Nhập tên tổ chức"
              value={tempOrgName}
              onChangeText={setTempOrgName}
              placeholderTextColor={COLORS.vinaupMediumGray}
              returnKeyType="next"
              onSubmitEditing={handleOrgInputSubmit}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên khách</Text>
            <TextInput
              ref={customerInputRef}
              style={styles.input}
              placeholder="Nhập tên khách"
              value={tempCustomerName}
              onChangeText={setTempCustomerName}
              placeholderTextColor={COLORS.vinaupMediumGray}
              returnKeyType="done"
              onSubmitEditing={handleCustomerInputSubmit}
              editable={!isLoading}
            />
          </View>

          <View style={styles.buttonGroup}>
            <Button
              style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Huỷ</Text>
            </Button>
            <Button
              style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={isLoading}
              isLoading={isLoading}
            >
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
    zIndex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupMediumDarkGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.vinaupBlack,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
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
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.vinaupTeal,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.vinaupMediumDarkGray,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
