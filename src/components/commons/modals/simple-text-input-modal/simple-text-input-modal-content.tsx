import { StyleSheet, Text, View, TextInput, Keyboard } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useRef, useState } from 'react';
import { Button } from '@/components/primitives/button';

interface SimpleTextInputModalContentProps {
  maxLength?: number;
  value?: string | null;
  placeholder?: string;
  isLoading?: boolean;
  onConfirm?: (value: string) => void;
  onCloseRequest?: () => void;
}

export function SimpleTextInputModalContent({
  maxLength = 100,
  value = '',
  placeholder,
  isLoading = false,
  onConfirm,
  onCloseRequest,
}: SimpleTextInputModalContentProps) {
  const [tempValue, setTempValue] = useState(value || '');
  const inputRef = useRef<TextInput>(null);

  const handleConfirm = () => {
    Keyboard.dismiss();
    onConfirm?.(tempValue);
  };

  const handleClose = () => {
    setTempValue(value || '');
    onCloseRequest?.();
  };

  return (
    <View style={styles.modalContent}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        maxLength={maxLength}
        value={tempValue}
        onChangeText={setTempValue}
        placeholder={placeholder}
        placeholderTextColor={COLORS.vinaupMediumGray}
        returnKeyType="done"
        editable={!isLoading}
        autoFocus
        onSubmitEditing={handleConfirm}
      />
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
          loaderStyle={{ color: COLORS.vinaupWhite }}
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
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.vinaupBlack,
    marginBottom: 16,
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

