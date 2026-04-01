import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { useState } from 'react';
import { Button } from '@/components/primitives/button';

export interface TourImplementationTicketCountData {
  adultQuantity: number;
  childQuantity: number;
}

interface TourImplementationTicketCountModalContentProps {
  initialData?: Partial<TourImplementationTicketCountData>;
  isLoading?: boolean;
  onConfirm?: (data: TourImplementationTicketCountData) => void;
  onCloseRequest?: () => void;
}

export function TourImplementationTicketCountModalContent({
  initialData,
  isLoading = false,
  onConfirm,
  onCloseRequest,
}: TourImplementationTicketCountModalContentProps) {
  const [adultQuantity, setAdultQuantity] = useState(
    initialData?.adultQuantity ? initialData.adultQuantity.toString() : ''
  );
  const [childQuantity, setChildQuantity] = useState(
    initialData?.childQuantity ? initialData.childQuantity.toString() : ''
  );

  const handleConfirm = () => {
    onConfirm?.({
      adultQuantity: Number(adultQuantity),
      childQuantity: Number(childQuantity),
    });
  };

  const renderInputRow = (
    label: string,
    value: string,
    onChangeText: (text: string) => void
  ) => {
    return (
      <View style={styles.inputItem}>
        <View style={styles.inputWrapper}>
          <View style={styles.labelSection}>
            <Text style={styles.insideLabel}>{label}</Text>
          </View>
          <View style={styles.separator} />
          <TextInput
            style={styles.inputNative}
            placeholder="0"
            keyboardType="numeric"
            value={value === '0' ? '' : value}
            onChangeText={onChangeText}
            placeholderTextColor={COLORS.vinaupMediumGray}
            editable={!isLoading}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.modalContent}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Số lượng</Text>
        {renderInputRow('Người lớn', adultQuantity, setAdultQuantity)}
        {renderInputRow('Trẻ em', childQuantity, setChildQuantity)}
      </ScrollView>

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
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.vinaupBlueLink,
    marginBottom: 8,
    marginTop: 4,
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
    minHeight: 50,
    paddingRight: 8,
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
  inputNative: {
    flex: 1,
    textAlign: 'right',
    fontSize: 18,
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
