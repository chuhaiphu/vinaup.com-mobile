export const STORAGE_KEYS = {
  currentUser: 'current-user',
  accessToken: 'access-token',
  homeUtilities: 'home-utilities',
};

export const HOME_UTILITY_KEYS = {
  receiptPaymentSelf: 'receipt-payment-self',
  receiptPaymentProjectSelf: 'receipt-payment-project-self',
  receiptPaymentProjectCompany: 'receipt-payment-project-company',
} as const;
export type HomeUtilityKey = (typeof HOME_UTILITY_KEYS)[keyof typeof HOME_UTILITY_KEYS];