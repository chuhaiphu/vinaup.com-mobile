import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useRef, useState } from 'react';
import { Button } from '@/components/primitives/button';

interface ProjectOrgCustomerEditModalContentProps {
  organizationName?: string | null;
  customerName?: string | null;
  isLoading?: boolean;
  onConfirm?: (organizationName: string, customerName: string) => void;
  onCloseRequest?: () => void;
}

export function ProjectOrgCustomerEditModalContent({
  organizationName = '',
  customerName = '',
  isLoading = false,
  onConfirm,
  onCloseRequest,
}: ProjectOrgCustomerEditModalContentProps) {
  const [tempOrgName, setTempOrgName] = useState(organizationName || '');
  const [tempCustomerName, setTempCustomerName] = useState(customerName || '');

  const orgInputRef = useRef<TextInput>(null);
  const customerInputRef = useRef<TextInput>(null);

  const handleConfirm = () => {
    if (!tempOrgName.trim() || !tempCustomerName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    onConfirm?.(tempOrgName, tempCustomerName);
  };

  const handleClose = () => {
    setTempOrgName(organizationName || '');
    setTempCustomerName(customerName || '');
    onCloseRequest?.();
  };

  const handleOrgInputSubmit = () => {
    customerInputRef.current?.focus();
  };

  const handleCustomerInputSubmit = () => {
    handleConfirm();
  };

  return (
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
          onPress={handleClose}
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
  );
}

const styles = StyleSheet.create({
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
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
    fontWeight: '500',
    color: COLORS.vinaupTeal,
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

