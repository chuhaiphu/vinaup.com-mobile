import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../primitives/button';
import { KeyboardSafeAvoidingView } from '../primitives/keyboard-safe-avoiding-view';

interface SimpleTextInputModalProps {
  visible: boolean;
  value?: string | null;
  placeholder?: string;
  isLoading?: boolean;
  onConfirm?: (value: string) => void;
  onClose?: () => void;
}

export function SimpleTextInputModal({
  visible,
  value = '',
  placeholder,
  isLoading = false,
  onConfirm,
  onClose,
}: SimpleTextInputModalProps) {
  const [tempValue, setTempValue] = useState(value || '');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) setTempValue(value || '');
  }, [visible, value]);

  const handleConfirm = () => {
    Keyboard.dismiss();
    onConfirm?.(tempValue);
  };

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalOverlay} onPress={onClose} />
        <KeyboardSafeAvoidingView style={styles.modalContent}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={tempValue}
            onChangeText={setTempValue}
            placeholder={placeholder}
            placeholderTextColor={COLORS.vinaupMediumGray}
            returnKeyType="done"
            editable={!isLoading}
            autoFocus
            onSubmitEditing={handleConfirm}
          />
          <Button
            style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </Button>
        </KeyboardSafeAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
    zIndex: 1,
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
  confirmButton: {
    backgroundColor: COLORS.vinaupTeal,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
