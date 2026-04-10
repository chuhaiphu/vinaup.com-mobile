import React, { useEffect, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFetch } from 'fetchwire';
import { ReceiptPaymentType } from '@/constants/receipt-payment-constants';
import { COLORS } from '@/constants/style-constant';
import { getCategoriesOfCurrentUserApi } from '@/apis/category-apis';
import { getReceiptPaymentByIdApi } from '@/apis/receipt-payment-apis';
import VinaupLeftArrowWithFill from '@/components/icons/vinaup-left-arrow-with-fill.native';
import VinaupRightArrowWithFill from '@/components/icons/vinaup-right-arrow-with-fill.native';
import { Select, SelectOption } from '@/components/primitives/select';
import { DateTimePicker } from '@/components/primitives/date-time-picker';
import { useReceiptPaymentFormStore } from '@/hooks/use-receipt-payment-form-store';

type ReceiptPaymentFormParams = {
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
};

export type ReceiptPaymentFormContentRef = {
  refreshDetail: () => void;
};

type ReceiptPaymentFormContentProps = {
  ref?: React.Ref<ReceiptPaymentFormContentRef>;
};

export function ReceiptPaymentFormContent({ ref }: ReceiptPaymentFormContentProps) {
  const params = useLocalSearchParams<ReceiptPaymentFormParams>();
  const initializeForm = useReceiptPaymentFormStore(
    (state) => state.initializeForm
  );
  const resetForm = useReceiptPaymentFormStore((state) => state.resetForm);
  const description = useReceiptPaymentFormStore((state) => state.description);
  const setDescription = useReceiptPaymentFormStore(
    (state) => state.setDescription
  );
  const unitPrice = useReceiptPaymentFormStore((state) => state.unitPrice);
  const setUnitPrice = useReceiptPaymentFormStore((state) => state.setUnitPrice);
  const quantity = useReceiptPaymentFormStore((state) => state.quantity);
  const setQuantity = useReceiptPaymentFormStore((state) => state.setQuantity);
  const frequency = useReceiptPaymentFormStore((state) => state.frequency);
  const setFrequency = useReceiptPaymentFormStore((state) => state.setFrequency);
  const type = useReceiptPaymentFormStore((state) => state.type);
  const setType = useReceiptPaymentFormStore((state) => state.setType);
  const vatRate = useReceiptPaymentFormStore((state) => state.vatRate);
  const setVatRate = useReceiptPaymentFormStore((state) => state.setVatRate);
  const transactionType = useReceiptPaymentFormStore(
    (state) => state.transactionType
  );
  const setTransactionType = useReceiptPaymentFormStore(
    (state) => state.setTransactionType
  );
  const note = useReceiptPaymentFormStore((state) => state.note);
  const setNote = useReceiptPaymentFormStore((state) => state.setNote);
  const transactionDate = useReceiptPaymentFormStore(
    (state) => state.transactionDate
  );
  const setTransactionDate = useReceiptPaymentFormStore(
    (state) => state.setTransactionDate
  );
  const selectedCategory = useReceiptPaymentFormStore(
    (state) => state.selectedCategory
  );
  const setSelectedCategory = useReceiptPaymentFormStore(
    (state) => state.setSelectedCategory
  );
  const inputErrors = useReceiptPaymentFormStore((state) => state.inputErrors);
  const setInputErrors = useReceiptPaymentFormStore(
    (state) => state.setInputErrors
  );
  const validateByInputField = useReceiptPaymentFormStore(
    (state) => state.validateByInputField
  );

  const { receiptPaymentId } = params;
  const isUpdateMode = receiptPaymentId !== 'new';

  const categoriesFetchKey = `receipt-payment-form-categories-${params.organizationId || 'self'}`;
  const { data: categories } = useFetch(
    () => getCategoriesOfCurrentUserApi(),
    categoriesFetchKey
  );

  const receiptDetailFetchKey = isUpdateMode
    ? `receipt-payment-detail-${receiptPaymentId}`
    : 'receipt-payment-detail-new';

  const { data: existingReceiptPayment, refreshFetch } = useFetch(
    async () => {
      if (!isUpdateMode) {
        return null;
      }
      return getReceiptPaymentByIdApi(receiptPaymentId);
    },
    receiptDetailFetchKey,
    {
      tags: [receiptDetailFetchKey],
    }
  );

  useImperativeHandle(
    ref,
    () => ({
      refreshDetail: refreshFetch,
    }),
    [refreshFetch]
  );

  const normalizedCategories = categories ?? [];
  const categoryOptionsData: SelectOption[] = normalizedCategories.map((item) => ({
    label: item.description,
    value: item.id,
  }));

  const defaultCategory = normalizedCategories.find((item) => item.isDefault);

  useEffect(() => {
    if (isUpdateMode) {
      initializeForm({
        existingReceiptPayment,
      });
    } else {
      initializeForm({
        receiptPaymentType: params.receiptPaymentType,
        defaultCategoryId: defaultCategory?.id,
        transactionDate: params.transactionDate,
      });
    }
  }, [
    defaultCategory?.id,
    existingReceiptPayment,
    initializeForm,
    isUpdateMode,
    params.receiptPaymentType,
    params.transactionDate,
    receiptPaymentId,
  ]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  return (
    <ScrollView style={styles.modalBody} bounces={false}>
      <View style={styles.modalBodyContainer}>
        <View style={styles.dateAndCategoryRow}>
          <DateTimePicker
            value={transactionDate}
            onChange={setTransactionDate}
            isLocked={params.lockDatePicker === 'true'}
          />

          <Select
            options={categoryOptionsData}
            value={selectedCategory}
            onChange={setSelectedCategory}
            disabled={params.allowEditCategory === 'false'}
            placeholder="Chọn danh mục"
          />
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
                setInputErrors({
                  ...inputErrors,
                  description: validateByInputField('description', val),
                });
              }}
              placeholder="..."
              maxLength={40}
            />
          </View>
        </View>

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
              value={unitPrice}
              keyboardType="numeric"
              onChangeText={(val) => {
                setUnitPrice(val);
                setInputErrors({
                  ...inputErrors,
                  unitPrice: validateByInputField('unitPrice', val),
                });
              }}
            />
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyText}>VND</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputItem}>
          <View style={styles.inputWrapper}>
            <View style={styles.labelSection}>
              <Text style={styles.insideLabel}>Số lượng</Text>
            </View>
            <View style={styles.separator} />
            <TextInput
              style={[styles.inputNative, { flex: 1 }]}
              value={quantity.toString()}
              keyboardType="numeric"
              onChangeText={(val) => setQuantity(val)}
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
                value={frequency.toString()}
                keyboardType="numeric"
                onChangeText={(val) => setFrequency(val)}
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
                placeholder="0"
                style={styles.inputNative}
                value={vatRate.toString()}
                keyboardType="numeric"
                onChangeText={(val) => setVatRate(val)}
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
  );
}

const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
    backgroundColor: COLORS.vinaupLightWhite,
  },
  modalBodyContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
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
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    overflow: 'hidden',
    minHeight: 50,
    paddingRight: 8,
  },
  inputNative: {
    flex: 1,
    textAlign: 'right',
    fontSize: 18,
  },
  currencyBadge: {
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyText: {
    color: 'black',
    fontSize: 14,
  },
  segmentMini: {
    width: 80,
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
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
});
