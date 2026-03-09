import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/button';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import dayjs, { Dayjs } from 'dayjs';

interface InvoiceInfoModalProps {
  invDescription?: string;
  invCode?: string;
  invStartDate?: Date;
  visible: boolean;
  isLoading?: boolean;
  onConfirm?: (data: {
    description: string;
    startDate: Date;
    endDate: Date;
    code?: string;
  }) => void;
  onClose?: () => void;
}

export function InvoiceInfoModal({
  invDescription = '',
  invCode = '',
  invStartDate,
  visible,
  isLoading = false,
  onConfirm,
  onClose,
}: InvoiceInfoModalProps) {
  const [description, setDescription] = useState(invDescription);
  const [code, setCode] = useState(invCode);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs(invStartDate));
  const [inputErrors, setInputErrors] = useState<{
    description?: boolean;
    code?: boolean;
  }>({});

  useEffect(() => {
    if (visible) {
      setInputErrors({});
    }
  }, [visible]);

  const handleConfirm = () => {
    const errors: typeof inputErrors = {};
    if (!description.trim()) errors.description = true;
    if (code.trim() === '') errors.code = true;
    setInputErrors(errors);
    if (Object.keys(errors).length > 0) return;

    onConfirm?.({
      description,
      startDate: startDate.toDate(),
      endDate: startDate.hour(23).minute(59).toDate(),
      code: code.trim() || undefined,
    });
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
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputItem}>
              <View
                style={[
                  styles.inputWrapper,
                  inputErrors.description && styles.inputError,
                ]}
              >
                <View style={styles.labelSection}>
                  <Text
                    style={[
                      styles.insideLabel,
                      inputErrors.description && styles.labelError,
                    ]}
                  >
                    Tiêu đề
                  </Text>
                </View>
                <View style={styles.separator} />
                <TextInput
                  style={styles.inputNative}
                  placeholder="..."
                  maxLength={40}
                  value={description}
                  onChangeText={(value) => {
                    setDescription(value);
                    setInputErrors((prev) => ({
                      ...prev,
                      description: !value.trim() ? true : undefined,
                    }));
                  }}
                  placeholderTextColor={COLORS.vinaupMediumGray}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputItem}>
              <View
                style={[
                  styles.inputWrapper,
                  inputErrors.code && styles.inputError,
                ]}
              >
                <View style={styles.labelSection}>
                  <Text
                    style={[
                      styles.insideLabel,
                      inputErrors.code && styles.labelError,
                    ]}
                  >
                    No.
                  </Text>
                </View>
                <View style={styles.separator} />
                <TextInput
                  style={styles.inputNative}
                  value={code}
                  placeholder="Mã số"
                  onChangeText={(value) => {
                    setCode(value);
                    setInputErrors((prev) => ({
                      ...prev,
                      code: value.trim() === '' ? true : undefined,
                    }));
                  }}
                  placeholderTextColor={COLORS.vinaupMediumGray}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.dateRow}>
                <Text style={styles.inputLabel}>Ngày</Text>
                <View style={styles.dateTimeRow}>
                  <DateTimePicker
                    mode="date"
                    value={startDate}
                    onChange={(d) => {
                      setStartDate(
                        startDate
                          .year(d.year())
                          .month(d.month())
                          .date(d.date())
                      );
                    }}
                    displayFormat="DD/MM/YYYY"
                    disabled={isLoading}
                  />
                  <DateTimePicker
                    mode="time"
                    value={startDate}
                    onChange={(d) => {
                      setStartDate(
                        startDate.hour(d.hour()).minute(d.minute())
                      );
                    }}
                    displayFormat="HH:mm"
                    disabled={isLoading}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

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
    backgroundColor: COLORS.vinaupLightWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
    zIndex: 1,
    maxHeight: '80%',
  },
  inputItem: {
    width: '100%',
    marginVertical: 6,
  },
  labelSection: {
    width: 100,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  insideLabel: {
    fontSize: 18,
    color: '#333',
  },
  separator: {
    width: 1.5,
    height: '70%',
    backgroundColor: COLORS.vinaupMediumDarkGray,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    overflow: 'hidden',
    minHeight: 50,
  },
  inputNative: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 18,
  },
  inputGroup: {
    marginBottom: 8,
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 18,
    color: '#333',
  },
  labelError: {
    color: COLORS.vinaupRed,
  },
  inputError: {
    borderColor: COLORS.vinaupRed,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
