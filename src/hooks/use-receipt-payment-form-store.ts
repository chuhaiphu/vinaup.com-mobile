import dayjs, { Dayjs } from 'dayjs';
import { create } from 'zustand';
import {
  ReceiptPaymentTransactionType,
  ReceiptPaymentType,
} from '@/constants/receipt-payment-constants';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';

export interface ReceiptPaymentInputErrors {
  description?: boolean;
  unitPrice?: boolean;
}

interface ReceiptPaymentFormDefaults {
  receiptPaymentType?: ReceiptPaymentType;
  transactionDate?: string;
  defaultCategoryId?: string;
  existingReceiptPayment?: ReceiptPaymentResponse | null;
}

interface ReceiptPaymentFormStore {
  description: string;
  unitPrice: string;
  quantity: string;
  frequency: string;
  type: ReceiptPaymentType;
  vatRate: string;
  transactionType: ReceiptPaymentTransactionType;
  note: string;
  transactionDate: Dayjs;
  selectedCategory: string;
  inputErrors: ReceiptPaymentInputErrors;

  setDescription: (value: string) => void;
  setUnitPrice: (value: string) => void;
  setQuantity: (value: string) => void;
  setFrequency: (value: string) => void;
  setType: (value: ReceiptPaymentType) => void;
  setVatRate: (value: string) => void;
  setTransactionType: (value: ReceiptPaymentTransactionType) => void;
  setNote: (value: string) => void;
  setTransactionDate: (value: Dayjs) => void;
  setSelectedCategory: (value: string) => void;
  setInputErrors: (value: ReceiptPaymentInputErrors) => void;

  validateByInputField: (
    input: 'description' | 'unitPrice',
    value: string
  ) => boolean;
  validateBeforeSave: () => boolean;
  initializeForm: (defaults?: ReceiptPaymentFormDefaults) => void;
  resetForm: () => void;
}

export const useReceiptPaymentFormStore = create<ReceiptPaymentFormStore>()(
  (set, get) => ({
    description: '',
    unitPrice: '',
    quantity: '1',
    frequency: '1',
    type: 'PAYMENT',
    vatRate: '',
    transactionType: 'CASH',
    note: '',
    transactionDate: dayjs(),
    selectedCategory: '',
    inputErrors: {},

    setDescription: (value) => set({ description: value }),
    setUnitPrice: (value) => set({ unitPrice: value }),
    setQuantity: (value) => set({ quantity: value }),
    setFrequency: (value) => set({ frequency: value }),
    setType: (value) => set({ type: value }),
    setVatRate: (value) => set({ vatRate: value }),
    setTransactionType: (value) => set({ transactionType: value }),
    setNote: (value) => set({ note: value }),
    setTransactionDate: (value) => set({ transactionDate: value }),
    setSelectedCategory: (value) => set({ selectedCategory: value }),
    setInputErrors: (value) => set({ inputErrors: value }),

    validateByInputField: (input, value) => {
      switch (input) {
        case 'description':
          return !value.trim();
        case 'unitPrice':
          return !value.trim() || Number(value) <= 0;
        default:
          return false;
      }
    },

    validateBeforeSave: () => {
      const { description, unitPrice } = get();
      const nextErrors: ReceiptPaymentInputErrors = {
        description: !description.trim(),
        unitPrice: Number(unitPrice) <= 0,
      };

      set({ inputErrors: nextErrors });
      return !nextErrors.description && !nextErrors.unitPrice;
    },

    initializeForm: (initValue) => {
      if (initValue?.existingReceiptPayment) {
        const value = initValue.existingReceiptPayment;
        set({
          description: value.description || '',
          unitPrice: value.unitPrice.toString(),
          quantity: value.quantity.toString(),
          frequency: value.frequency.toString(),
          type: value.type,
          vatRate: value.vatRate.toString(),
          transactionType: value.transactionType,
          note: value.note || '',
          transactionDate: dayjs(value.transactionDate),
          selectedCategory: value.category.id,
          inputErrors: {},
        });
        return;
      }

      set({
        description: '',
        unitPrice: '',
        quantity: '1',
        frequency: '1',
        type: initValue?.receiptPaymentType || 'PAYMENT',
        vatRate: '',
        transactionType: 'CASH',
        note: '',
        transactionDate: initValue?.transactionDate
          ? dayjs(initValue.transactionDate).hour(dayjs().hour()).minute(dayjs().minute()).second(dayjs().second())
          : dayjs(),
        selectedCategory: initValue?.defaultCategoryId || '',
        inputErrors: {},
      });
    },

    resetForm: () => {
      set({
        description: '',
        unitPrice: '',
        quantity: '1',
        frequency: '1',
        type: 'PAYMENT',
        vatRate: '',
        transactionType: 'CASH',
        note: '',
        transactionDate: dayjs(),
        selectedCategory: '',
        inputErrors: {},
      });
    },
  })
);
