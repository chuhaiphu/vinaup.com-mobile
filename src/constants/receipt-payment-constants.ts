export const RECEIPT_PAYMENT_TYPES = {
  RECEIPT: 'RECEIPT',
  PAYMENT: 'PAYMENT',
} as const;
export type ReceiptPaymentType =
  (typeof RECEIPT_PAYMENT_TYPES)[keyof typeof RECEIPT_PAYMENT_TYPES];

export const RECEIPT_PAYMENT_TRANSACTION_TYPES = {
  CASH: 'CASH',
  BANK: 'BANK',
} as const;
export type ReceiptPaymentTransactionType =
  (typeof RECEIPT_PAYMENT_TRANSACTION_TYPES)[keyof typeof RECEIPT_PAYMENT_TRANSACTION_TYPES];
