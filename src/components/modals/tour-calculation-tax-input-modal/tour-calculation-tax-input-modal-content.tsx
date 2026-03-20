import { StyleSheet, Text, View, TextInput } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useImperativeHandle, useRef, useState } from 'react';
import { Button } from '@/components/primitives/button';

export interface TourCalculationTaxtInputRef {
  focus: () => void;
}
interface TourCalculationTaxInputModalContentProps {
  initialTaxRate?: number;
  isLoading?: boolean;
  onConfirm?: (taxRate: number) => void;
  onCloseRequest?: () => void;
  ref?: React.RefObject<TourCalculationTaxtInputRef | null>;
}

export function TourCalculationTaxInputModalContent({
  initialTaxRate = 0,
  isLoading = false,
  onConfirm,
  onCloseRequest,
  ref,
}: TourCalculationTaxInputModalContentProps) {
  const [taxRate, setTaxRate] = useState(
    initialTaxRate.toString() === '0' ? '' : initialTaxRate.toString()
  );
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      inputRef.current?.setNativeProps({
        selection: { start: taxRate.length, end: taxRate.length },
      });
    },
  }));

  const handleConfirm = () => {
    const numericTax = parseFloat(taxRate) || 0;
    onConfirm?.(numericTax);
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.sectionTitle}>Thuế phải nộp</Text>
      <View style={styles.inputItem}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.inputNative}
            placeholder="0"
            keyboardType="decimal-pad"
            value={taxRate}
            onChangeText={setTaxRate}
            placeholderTextColor={COLORS.vinaupMediumGray}
            editable={!isLoading}
          />
          <View style={styles.suffixSection}>
            <Text style={styles.suffixLabel}>%</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <Button
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={onCloseRequest}
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
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.vinaupBlueLink,
    marginBottom: 16,
    fontWeight: '500',
  },
  inputItem: {
    width: '100%',
    marginVertical: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    overflow: 'hidden',
    paddingRight: 8,
  },
  inputNative: {
    flex: 1,
    textAlign: 'right',
    fontSize: 18,
    paddingRight: 8,
    color: '#000',
  },
  suffixSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffixLabel: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
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
