import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import dayjs, { Dayjs } from 'dayjs';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import {
  ReceiptPaymentTransactionType,
  ReceiptPaymentType,
} from '@/constants/receipt-payment-constants';
import {
  CreateReceiptPaymentRequest,
  ReceiptPaymentResponse,
} from '@/interfaces/receipt-payment-interfaces';
import { COLORS } from '@/constants/style-constant';
import { Select } from '@/components/primitives/select';
import { getCategoriesOfCurrentUserApi } from '@/apis/category-apis';
import { useFetchFn, useMutationFn } from 'fetchwire';
import { CategoryResponse } from '@/interfaces/category-interfaces';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import VinaupLeftArrowWithFill from '@/components/icons/vinaup-left-arrow-with-fill.native';
import VinaupRightArrowWithFill from '@/components/icons/vinaup-right-arrow-with-fill.native';
import {
  createReceiptPaymentApi,
  deleteReceiptPaymentApi,
  getReceiptPaymentByIdApi,
  updateReceiptPaymentApi,
} from '@/apis/receipt-payment-apis';
import Loader from '@/components/primitives/loader';
import { useSafeRouter } from '@/hooks/use-safe-router';

export default function ReceiptPaymentFormScreen() {
  const safeRouter = useSafeRouter();
  const params = useLocalSearchParams<{
    receiptPaymentId: string;
    groupCode?: 'FOR_DIRECTOR' | 'FOR_TOUR_GUIDE';
    organizationId?: string;
    receiptPaymentType?: ReceiptPaymentType;
    projectId?: string;
    invoiceId?: string;
    bookingId?: string;
    tourCalculationId?: string;
    tourImplementationId?: string;
    tourSettlementId?: string;
    lockDatePicker?: string;
    allowEditCategory?: string;
    transactionDate?: string;
  }>();

  const { receiptPaymentId } = params;
  const isUpdateMode = receiptPaymentId !== 'new';

  const {
    data: existingReceiptPayment,
    isLoading: isFetchingReceiptPayment,
    executeFetchFn: fetchReceiptPayment,
  } = useFetchFn<ReceiptPaymentResponse>();

  useEffect(() => {
    if (existingReceiptPayment) {
      setDescription(existingReceiptPayment.description || '');
      setUnitPrice(existingReceiptPayment.unitPrice);
      setQuantity(existingReceiptPayment.quantity);
      setFrequency(existingReceiptPayment.frequency ?? 1);
      setType(existingReceiptPayment.type);
      setVatRate(existingReceiptPayment.vatRate || 0);
      setTransactionType(existingReceiptPayment.transactionType);
      setNote(existingReceiptPayment.note || '');
      setTransactionDate(dayjs(existingReceiptPayment.transactionDate));
      setSelectedCategory(existingReceiptPayment.category.id);
    }
  }, [existingReceiptPayment]);

  useEffect(() => {
    if (isUpdateMode) {
      fetchReceiptPayment(() => getReceiptPaymentByIdApi(receiptPaymentId));
    }
  }, [receiptPaymentId, isUpdateMode, fetchReceiptPayment]);

  const { data: categories, executeFetchFn: fetchCategories } =
    useFetchFn<CategoryResponse[]>();

  useEffect(() => {
    fetchCategories(() => getCategoriesOfCurrentUserApi());
  }, [fetchCategories]);

  const formInvalidatesTags = (() => {
    switch (true) {
      case !!params.projectId:
        return ['personal-receipt-payment-list-in-project'];
      case !!params.invoiceId:
        return ['organization-receipt-payment-list-in-invoice'];
      default:
        return ['personal-receipt-payment-list'];
    }
  })();

  const {
    executeMutationFn: createOrUpdateReceiptPayment,
    isMutating: isMutatingReceiptPayment,
  } = useMutationFn<ReceiptPaymentResponse>({
    invalidatesTags: formInvalidatesTags,
  });
  const {
    executeMutationFn: deleteReceiptPayment,
    isMutating: isDeletingReceiptPayment,
  } = useMutationFn({
    invalidatesTags: formInvalidatesTags,
  });

  const categoryOptionsData =
    categories?.map((c) => ({
      label: c.description,
      value: c.id,
    })) || [];
  const defaultCategoryOption = categories?.find((opt) => opt.isDefault);
  useEffect(() => {
    if (defaultCategoryOption) {
      setSelectedCategory(defaultCategoryOption.id);
    }
  }, [defaultCategoryOption]);

  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [frequency, setFrequency] = useState<number>(1);
  const [type, setType] = useState<ReceiptPaymentType>(
    params.receiptPaymentType || 'PAYMENT'
  );
  const [vatRate, setVatRate] = useState<number>(0);
  const [transactionType, setTransactionType] =
    useState<ReceiptPaymentTransactionType>('CASH');
  const [note, setNote] = useState('');
  const [transactionDate, setTransactionDate] = useState<Dayjs>(
    params.transactionDate ? dayjs(params.transactionDate) : dayjs()
  );
  const [selectedCategory, setSelectedCategory] = useState(
    defaultCategoryOption?.id || ''
  );
  const [isDescriptionSelectMode, setIsDescriptionSelectMode] = useState(false);

  // Validation state
  const [inputErrors, setInputErrors] = useState<{
    description?: boolean;
    unitPrice?: boolean;
  }>({});

  const validateByInputField = (
    input: 'description' | 'unitPrice',
    value: string
  ) => {
    switch (input) {
      case 'description':
        return !value.trim();
      case 'unitPrice':
        return !value.trim() || Number(value) <= 0;
      default:
        return false;
    }
  };

  const handleSaveAndExit = () => {
    if (!description.trim() || unitPrice <= 0) {
      setInputErrors({
        description: !description.trim(),
        unitPrice: unitPrice <= 0,
      });
      return;
    }

    const submitData: CreateReceiptPaymentRequest = {
      description,
      unitPrice,
      quantity,
      frequency,
      type,
      vatRate,
      transactionType,
      note,
      transactionDate: transactionDate.toDate(),
      currency: 'VND',
      categoryId: selectedCategory,
      projectId: params.projectId,
      invoiceId: params.invoiceId,
      bookingId: params.bookingId,
      tourCalculationId: params.tourCalculationId,
      tourImplementationId: params.tourImplementationId,
      tourSettlementId: params.tourSettlementId,
      groupCode: params.groupCode,
      organizationId: params.organizationId,
    };

    const mutationApi = isUpdateMode
      ? () => updateReceiptPaymentApi(receiptPaymentId, submitData)
      : () => createReceiptPaymentApi(submitData);

    createOrUpdateReceiptPayment(mutationApi, {
      onSuccess: () => {
        safeRouter.safeBack();
      },
      onError: (error) => {
        Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi tạo thu/chi.');
      },
    });
  };

  const handleDelete = () => {
    if (!isUpdateMode) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          deleteReceiptPayment(() => deleteReceiptPaymentApi(receiptPaymentId), {
            onSuccess: () => {
              safeRouter.safeBack();
            },
            onError: (error) => {
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screenContainer}
    >
      <StackWithHeader
        title={isUpdateMode ? 'Sửa Thu / Chi' : 'Tạo Thu / Chi'}
        onDelete={isUpdateMode ? handleDelete : undefined}
        isDeleting={isDeletingReceiptPayment}
        onSave={handleSaveAndExit}
        isSaving={isMutatingReceiptPayment}
      />
      {isFetchingReceiptPayment ? (
        <View style={styles.loadingContainer}>
          <Loader size={64} />
        </View>
      ) : (
        <ScrollView style={styles.modalBody} bounces={false}>
          <View style={styles.modalBodyContainer}>
            {/* Row: Date & Category/Toggle */}
            <View style={styles.dateAndCategoryRow}>
              <DateTimePicker
                value={transactionDate}
                onChange={setTransactionDate}
                isLocked={params.lockDatePicker === 'true'}
              />

              {params.invoiceId ? (
                <View style={styles.rowAlign}>
                  <Text>
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
                <Select
                  options={categoryOptionsData}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  disabled={params.allowEditCategory === 'false'}
                  placeholder="Chọn danh mục"
                />
              )}
            </View>

            <View style={styles.inputItem}>
              <View
                style={[
                  styles.inputWrapper,
                  inputErrors.description && { borderColor: COLORS.vinaupRed },
                ]}
              >
                <View style={styles.labelSection}>
                  <Text
                    style={[
                      styles.insideLabel,
                      inputErrors.description && { color: COLORS.vinaupRed },
                    ]}
                  >
                    Nội dung
                  </Text>
                </View>
                <View style={styles.separator} />
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

            {/* Đơn giá */}
            <View style={styles.inputItem}>
              <View
                style={[
                  styles.inputWrapper,
                  inputErrors.unitPrice && { borderColor: COLORS.vinaupRed },
                ]}
              >
                <View style={styles.labelSection}>
                  <Text
                    style={[
                      styles.insideLabel,
                      inputErrors.unitPrice && { color: COLORS.vinaupRed },
                    ]}
                  >
                    Đơn giá
                  </Text>
                </View>
                <View style={styles.separator} />
                <TextInput
                  style={[styles.inputNative, { flex: 1 }]}
                  value={String(unitPrice)}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    setUnitPrice(Number(val));
                    setInputErrors((prev) => ({
                      ...prev,
                      unitPrice: validateByInputField('unitPrice', val),
                    }));
                  }}
                />
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyText}>VND</Text>
                </View>
              </View>
            </View>

            {/* SL & Segment (BANK/CASH) */}
            <View style={styles.inputItem}>
              <View style={styles.inputWrapper}>
                <View style={styles.labelSection}>
                  <Text style={styles.insideLabel}>Số lượng</Text>
                </View>
                <View style={styles.separator} />
                <TextInput
                  style={[styles.inputNative, { flex: 1 }]}
                  value={String(quantity)}
                  keyboardType="numeric"
                  onChangeText={(val) => setQuantity(Number(val))}
                />
                <View style={styles.segmentMini}>
                  <Pressable
                    style={[styles.segmentMiniItem]}
                    onPress={() => setTransactionType('BANK')}
                  >
                    <MaterialCommunityIcons
                      name="bank"
                      size={28}
                      color={
                        transactionType === 'BANK'
                          ? COLORS.vinaupTeal
                          : COLORS.vinaupLightGray
                      }
                    />
                  </Pressable>
                  <Pressable
                    style={[styles.segmentMiniItem]}
                    onPress={() => setTransactionType('CASH')}
                  >
                    <FontAwesome5
                      name="money-bill-wave"
                      size={24}
                      color={
                        transactionType === 'CASH'
                          ? COLORS.vinaupTeal
                          : COLORS.vinaupLightGray
                      }
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.inputCombinedItem}>
              <View style={styles.typeSwitcher}>
                <Pressable
                  style={[styles.typeBtn, { justifyContent: 'flex-end' }]}
                  onPress={() => setType('RECEIPT')}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      type === 'RECEIPT' && { color: COLORS.vinaupTeal },
                    ]}
                  >
                    + Thu
                  </Text>
                  <VinaupLeftArrowWithFill
                    height={33}
                    width={22}
                    color={type === 'RECEIPT' ? COLORS.vinaupTeal : undefined}
                  />
                </Pressable>
                <Pressable
                  style={[styles.typeBtn, { justifyContent: 'flex-start' }]}
                  onPress={() => setType('PAYMENT')}
                >
                  <VinaupRightArrowWithFill
                    height={33}
                    width={22}
                    color={type === 'PAYMENT' ? COLORS.vinaupTeal : undefined}
                  />
                  <Text
                    style={[
                      styles.typeBtnText,
                      type === 'PAYMENT' && { color: COLORS.vinaupTeal },
                    ]}
                  >
                    - Chi
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.inputItem, { flexDirection: 'row', gap: 8 }]}>
              <View style={{ flex: 0.66 }}>
                <View style={styles.inputWrapper}>
                  <View style={styles.labelSection}>
                    <Text style={styles.insideLabel}>Số lần</Text>
                  </View>
                  <View style={styles.separator} />
                  <TextInput
                    style={[styles.inputNative, { flex: 1 }]}
                    value={String(frequency)}
                    keyboardType="numeric"
                    onChangeText={(val) => setFrequency(Number(val))}
                  />
                </View>
              </View>

              <View style={{ flex: 0.34 }}>
                <View style={styles.inputWrapper}>
                  <View style={[styles.labelSection, { width: 45 }]}>
                    <Text style={styles.insideLabel}>Vat</Text>
                  </View>
                  <View style={styles.separator} />
                  <TextInput
                    style={styles.inputNative}
                    value={String(vatRate)}
                    keyboardType="numeric"
                    onChangeText={(val) => setVatRate(Number(val))}
                  />
                  <Text style={styles.unitText}>%</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputItem}>
              <View style={styles.inputWrapper}>
                <View style={styles.labelSection}>
                  <Text style={styles.insideLabel}>Ghi chú</Text>
                </View>
                <View style={styles.separator} />
                <TextInput
                  style={[styles.inputNative, { flex: 1 }]}
                  value={note}
                  onChangeText={setNote}
                  placeholder="..."
                  maxLength={40}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.vinaupLightWhite,
  },
  modalBody: {
    flex: 1,
    backgroundColor: COLORS.vinaupLightWhite,
  },
  modalBodyContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateAndCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputItem: {
    width: '100%',
    marginVertical: 6,
  },
  labelSection: {
    width: 100,
    justifyContent: 'center',
    paddingLeft: 8,
    borderRightColor: '#E0E0E0',
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
  currencyBadge: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyText: {
    color: 'black',
    fontSize: 14,
  },
  segmentMini: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },
  segmentMiniItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCombinedItem: {
    marginVertical: 2,
  },
  typeSwitcher: {
    flexDirection: 'row',
    flex: 1,
    gap: 2,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  typeBtnText: {
    color: COLORS.vinaupLightGray,
    fontSize: 20,
    fontWeight: '500',
  },
  unitText: {
    width: 50,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
  iconBtn: {
    marginLeft: 25,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
