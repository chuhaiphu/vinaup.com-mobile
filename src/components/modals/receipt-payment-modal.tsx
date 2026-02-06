import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import {
  ReceiptPaymentTransactionType,
  ReceiptPaymentType,
} from '@/constants/receipt-payment-constants';
import {
  CreateReceiptPaymentRequest,
  ReceiptPaymentResponse,
} from '@/interfaces/receipt-payment-interfaces';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import { BookingResponse } from '@/interfaces/booking-interfaces';
import { useReceiptPaymentModalStore } from '@/hooks/use-modal-store';
import { COLORS } from '@/constants/style-constant';
import VinaupSaveIcon from '../icons/vinaup-save-icon.native';
import VinaupSaveAndExitIcon from '../icons/vinaup-save-and-exit-icon.native';
import VinaupCollapseToggle from '../icons/vinaup-collapse-toggle.native';

export interface ComboboxOptionProps {
  label: string;
  value: string;
  isDefault: boolean;
}

interface ReceiptPaymentModalProps {
  groupCode?: 'FOR_DIRECTOR' | 'FOR_TOUR_GUIDE';
  organizationId?: string;
  receiptPaymentsData: ReceiptPaymentResponse[];
  receiptPaymentType: ReceiptPaymentType;
  categoryOptionsData: ComboboxOptionProps[];
  projectData?: ProjectResponse | null;
  invoiceData?: InvoiceResponse | null;
  bookingData?: BookingResponse | null;
  tourCalculationId?: string;
  tourImplementationId?: string;
  tourSettlementId?: string;
  lockDatePicker?: boolean;
  allowEditCategory?: boolean;
}

export default function ReceiptPaymentModal({
  groupCode,
  receiptPaymentsData,
  organizationId,
  receiptPaymentType,
  categoryOptionsData,
  projectData,
  invoiceData,
  bookingData,
  tourCalculationId,
  tourImplementationId,
  tourSettlementId,
  lockDatePicker,
  allowEditCategory = false,
}: Readonly<ReceiptPaymentModalProps>) {
  const editingId = useReceiptPaymentModalStore((s) => s.editingId);
  const receiptPaymentByIdData = receiptPaymentsData?.find(
    (rp) => rp.id === editingId
  );
  const closeModal = useReceiptPaymentModalStore((s) => s.closeModal);
  const isOpened = useReceiptPaymentModalStore((s) => s.isOpen);
  const mode = useReceiptPaymentModalStore((s) => s.mode);
  const preselectedDate = useReceiptPaymentModalStore((s) => s.preselectedDate);

  // Static options
  const currencyOptionsData: ComboboxOptionProps[] = [
    { value: 'VND', label: 'VND', isDefault: true },
    { value: 'USD', label: 'USD', isDefault: false },
    { value: 'EUR', label: 'EUR', isDefault: false },
    { value: 'AUD', label: 'AUD', isDefault: false },
    { value: 'JPY', label: 'JPY', isDefault: false },
  ];

  // Modal state
  const [isDescriptionSelectMode, setIsDescriptionSelectMode] = useState(false);

  const [description, setDescription] = useState<string>(
    receiptPaymentByIdData?.description || ''
  );
  const [unitPrice, setUnitPrice] = useState<number>(
    receiptPaymentByIdData?.unitPrice || 1
  );
  const [quantity, setQuantity] = useState<number>(
    receiptPaymentByIdData?.quantity || 1
  );
  const [type, setType] = useState<ReceiptPaymentType>(receiptPaymentType);
  const [vatRate, setVatRate] = useState<number>(
    receiptPaymentByIdData?.vatRate || 0
  );
  const [transactionType, setTransactionType] =
    useState<ReceiptPaymentTransactionType>(
      receiptPaymentByIdData?.transactionType === 'BANK' ? 'BANK' : 'CASH'
    );
  const [note, setNote] = useState<string>(receiptPaymentByIdData?.note || '');
  const [transactionDate, setTransactionDate] = useState<Dayjs>(
    dayjs(receiptPaymentByIdData?.transactionDate || preselectedDate || new Date())
  );
  const [transactionTime, setTransactionTime] = useState<string>(
    dayjs(
      receiptPaymentByIdData?.transactionDate || preselectedDate || new Date()
    ).format('HH:mm:ss')
  );
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    receiptPaymentByIdData?.currency ||
      currencyOptionsData.find((option) => option.isDefault)!.value
  );
  const defaultedCategory = categoryOptionsData.find((option) => option.isDefault);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    receiptPaymentByIdData?.category.id || defaultedCategory?.value || ''
  );

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  // Validation
  const [inputErrors, setInputErrors] = useState<{
    description?: boolean;
    unitPrice?: boolean;
  }>({});

  const validateByInputField = (input: keyof typeof inputErrors, value: string) => {
    switch (input) {
      case 'description':
        return !value.trim();
      case 'unitPrice':
        return !value.trim() || Number(value) <= 0;
      default:
        return false;
    }
  };

  const validateAllInputs = () => {
    const newInputErrors: typeof inputErrors = {};
    if (!description.trim()) newInputErrors.description = true;
    if (unitPrice <= 0) newInputErrors.unitPrice = true;

    setInputErrors(newInputErrors);
    return Object.keys(newInputErrors).length === 0;
  };

  const handleResetModal = () => {
    setDescription('');
    setUnitPrice(1);
    setQuantity(1);
    setType(receiptPaymentType);
    setVatRate(0);
    setTransactionType('CASH');
    setNote('');
    setTransactionDate(dayjs());
    setTransactionTime(dayjs().format('HH:mm:ss'));
    setSelectedCurrency('VND');
    setSelectedCategory('');
    setInputErrors({});
  };

  const [hour, minute] = transactionTime.split(':').map(Number);
  const combinedDateTime = transactionDate.hour(hour).minute(minute);

  // Modal-level action handlers
  const saveReceiptPayment = () => {
    if (!validateAllInputs()) return false;
    const submitReceiptPaymentData: CreateReceiptPaymentRequest = {
      description,
      unitPrice: Number(unitPrice),
      quantity,
      type,
      vatRate,
      transactionType,
      note,
      transactionDate: combinedDateTime.toDate(),
      currency: selectedCurrency,
      categoryId: selectedCategory,
      projectId: projectData?.id,
      invoiceId: invoiceData?.id,
      tourCalculationId: tourCalculationId,
      tourImplementationId: tourImplementationId,
      tourSettlementId: tourSettlementId,
      groupCode: groupCode || undefined,
      organizationId: organizationId || undefined,
      bookingId: bookingData?.id || undefined,
    };
    if (mode === 'create') {
      // createReceiptPaymentAction(submitReceiptPaymentData);
      handleResetModal();
    } else {
      // updateReceiptPaymentAction(editingId, submitReceiptPaymentData);
    }

    return true;
  };

  const handleSaveReceiptPayment = () => {
    saveReceiptPayment();
  };

  const handleSaveAndExitReceiptPayment = () => {
    const success = saveReceiptPayment();
    if (success) closeModal();
  };

  const handleDeleteReceiptPayment = () => {
    Alert.alert('Xác nhận / Confirm', 'Bạn muốn xoá ?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        onPress: () => {
          // deleteReceiptPaymentAction(editingId);
          handleResetModal();
          closeModal();
        },
      },
    ]);
  };

  // This is UTC time
  // Different location will display different time
  const updateCurentTime = () => {
    const now = new Date();
    setTransactionTime(dayjs(now).format('HH:mm:ss'));
  };

  // Automatically update the time
  useEffect(() => {
    if (mode != 'create') {
      return;
    }
    // Update every minute
    const interval = setInterval(updateCurentTime, 60000);

    // Return cleanup function
    // Run when component unmounts - Prevent memory leak
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <Modal visible={isOpened} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitleText}>
              {mode === 'create' ? 'Tạo Thu / Chi' : 'Sửa Thu / Chi'}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} bounces={false}>
            <View style={styles.modalBodyContainer}>
              {/* Row: Date & Category/Toggle */}
              <View style={styles.inputItem}>
                <TouchableOpacity
                  style={[styles.datePickerBtn, lockDatePicker && styles.disabled]}
                  disabled={lockDatePicker}
                >
                  <Text
                    style={[
                      styles.dateText,
                      lockDatePicker && { color: COLORS.vinaupMediumGray },
                    ]}
                  >
                    {transactionDate.format('DD/MM/YYYY')}
                  </Text>
                </TouchableOpacity>
                {invoiceData ? (
                  <View style={styles.rowAlign}>
                    <Text style={styles.italicLabel}>
                      {isDescriptionSelectMode ? 'Kho sản phẩm' : 'Nhập nội dung'}
                    </Text>
                    <Switch
                      value={isDescriptionSelectMode}
                      onValueChange={setIsDescriptionSelectMode}
                      trackColor={{ false: '#ccc', true: COLORS.vinaupTeal }}
                      thumbColor={COLORS.vinaupYellow}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.categoryBadge}
                    disabled={!allowEditCategory}
                  >
                    <Text style={styles.categoryText}>
                      {categoryOptionsData.find((o) => o.value === selectedCategory)
                        ?.label ||
                        defaultedCategory?.label ||
                        'Danh mục'}
                    </Text>
                    {allowEditCategory && (
                      <Ionicons name="chevron-down" size={14} color="white" />
                    )}
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputItem}>
                <Text
                  style={[
                    styles.label,
                    inputErrors.description && { color: COLORS.vinaupRed },
                  ]}
                >
                  Nội dung
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputNative}
                    value={description}
                    onChangeText={(val) => {
                      setDescription(val);
                      setInputErrors((prev) => ({
                        ...prev,
                        description: validateByInputField('description', val),
                      }));
                    }}
                    placeholder="..."
                    maxLength={40}
                  />
                </View>
              </View>

              <View style={styles.inputItem}>
                <Text
                  style={[
                    styles.label,
                    inputErrors.unitPrice && { color: COLORS.vinaupRed },
                  ]}
                >
                  Đơn giá
                </Text>
                <View style={[styles.inputWrapper, styles.rowAlign]}>
                  <TextInput
                    style={[styles.inputNative, { flex: 1 }]}
                    value={unitPrice === 0 ? '' : String(unitPrice)}
                    keyboardType="numeric"
                    maxLength={15}
                    onFocus={() => {
                      if (unitPrice === 1) setUnitPrice(0);
                    }}
                    onBlur={() => {
                      if (unitPrice === 0) setUnitPrice(1);
                    }}
                    onChangeText={(val) => {
                      if (val === '' || /^\d+$/.test(val)) {
                        setUnitPrice(val === '' ? 0 : Number(val));
                        setInputErrors((prev) => ({
                          ...prev,
                          unitPrice: validateByInputField('unitPrice', val),
                        }));
                      }
                    }}
                  />
                  <View style={styles.currencyBadge}>
                    <Text style={styles.currencyText}>{selectedCurrency}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.inputItem}>
                <Text style={styles.label}>SL</Text>
                <View style={[styles.inputWrapper, styles.rowAlign]}>
                  <TextInput
                    style={[styles.inputNative, { flex: 1 }]}
                    value={quantity === 0 ? '' : String(quantity)}
                    keyboardType="numeric"
                    maxLength={10}
                    onFocus={() => {
                      if (quantity === 1) setQuantity(0);
                    }}
                    onBlur={() => {
                      if (quantity === 0) setQuantity(1);
                    }}
                    onChangeText={(val) => {
                      if (val === '' || /^\d+$/.test(val)) {
                        setQuantity(val === '' ? 0 : Number(val));
                      }
                    }}
                  />
                  <View style={styles.segmentMini}>
                    {/* Nút Ngân Hàng */}
                    <Pressable
                      style={[
                        styles.segmentMiniItem,
                        transactionType === 'BANK'
                          ? ''
                          : styles.segmentMiniInactive,
                      ]}
                      onPress={() => setTransactionType('BANK')}
                    >
                      <MaterialCommunityIcons name="bank" size={18} color="white" />
                    </Pressable>

                    <Pressable
                      style={[
                        styles.segmentMiniItem,
                        transactionType === 'CASH'
                          ? ''
                          : styles.segmentMiniInactive,
                      ]}
                      onPress={() => setTransactionType('CASH')}
                    >
                      <FontAwesome5
                        name="money-bill-wave"
                        size={18}
                        color="white"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Toggle Collapse & Thu/Chi */}
              <View style={styles.inputCombinedItem}>
                <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                  <VinaupCollapseToggle
                    width={24}
                    height={24}
                    color={isCollapsed ? COLORS.vinaupTeal : 'gray'}
                  />
                </TouchableOpacity>
                <View style={styles.typeSwitcher}>
                  <Pressable
                    style={[
                      styles.typeBtn,
                      type === 'RECEIPT' && styles.typeBtnActive,
                    ]}
                    onPress={() => setType('RECEIPT')}
                  >
                    <Text
                      style={[
                        styles.typeBtnText,
                        type === 'RECEIPT' && styles.whiteText,
                      ]}
                    >
                      + Thu
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.typeBtn,
                      type === 'PAYMENT' && styles.typeBtnActive,
                    ]}
                    onPress={() => setType('PAYMENT')}
                  >
                    <Text
                      style={[
                        styles.typeBtnText,
                        type === 'PAYMENT' && styles.whiteText,
                      ]}
                    >
                      - Chi
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Collapsible Section */}
              {!isCollapsed && (
                <View>
                  <View style={styles.inputItem}>
                    <Text style={styles.label}>VAT</Text>
                    <View style={[styles.inputWrapper, styles.rowAlign]}>
                      <TextInput
                        style={[styles.inputNative, { flex: 1 }]}
                        value={vatRate === 0 ? '' : String(vatRate)}
                        keyboardType="numeric"
                        maxLength={5}
                        placeholder="0"
                        onChangeText={(val) => {
                          if (val === '' || /^\d+$/.test(val)) {
                            setVatRate(val === '' ? 0 : Number(val));
                          }
                        }}
                        onBlur={() => {
                          if (vatRate > 20) setVatRate(20);
                          if (vatRate < 0) setVatRate(0);
                        }}
                      />
                      <Text style={styles.unitText}>%</Text>
                    </View>
                  </View>
                  <View style={styles.inputItem}>
                    <Text style={styles.label}>Ghi chú</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputNative}
                        value={note}
                        onChangeText={setNote}
                        placeholder="..."
                        maxLength={40}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footerSection}>
            <View>
              {mode === 'update' && (
                <TouchableOpacity onPress={handleDeleteReceiptPayment}>
                  <Ionicons name="trash-outline" size={32} color="gray" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.rowAlign}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handleSaveReceiptPayment}
              >
                <VinaupSaveIcon width={30} height={30} color={COLORS.vinaupTeal} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handleSaveAndExitReceiptPayment}
              >
                <VinaupSaveAndExitIcon
                  width={42}
                  height={32}
                  color={COLORS.vinaupTeal}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 360,
    backgroundColor: COLORS.vinaupTeal,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.vinaupTeal,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalTitleText: {
    color: 'white',
    fontSize: 18,
  },
  modalBody: {
    backgroundColor: COLORS.vinaupLightWhite,
  },
  modalBodyContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  label: {
    fontSize: 16,
  },
  italicLabel: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.vinaupDarkGray,
    marginRight: 5,
  },
  inputWrapper: {
    width: '65%',
    backgroundColor: COLORS.vinaupTeal,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    overflow: 'hidden',
  },
  inputNative: {
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 16,
  },
  datePickerBtn: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupBlueLink,
  },
  dateText: {
    color: COLORS.vinaupBlueLink,
    fontSize: 16,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyBadge: {
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.vinaupTeal,
  },
  currencyText: {
    color: 'white',
    fontSize: 12,
  },
  segmentMini: {
    width: 72,
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },
  segmentMiniItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentMiniInactive: {
    backgroundColor: COLORS.vinaupLightGray,
  },
  inputCombinedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  typeSwitcher: {
    flexDirection: 'row',
    width: '65%',
    backgroundColor: '#FBFBFB',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    overflow: 'hidden',
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: COLORS.vinaupTeal,
  },
  typeBtnText: {
    color: COLORS.vinaupDarkGray,
    fontSize: 14,
  },
  whiteText: {
    color: 'white',
  },
  unitText: {
    paddingHorizontal: 10,
    color: 'black',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.vinaupLightWhite,
  },
  iconBtn: {
    marginLeft: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.vinaupTeal,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
  },
});
