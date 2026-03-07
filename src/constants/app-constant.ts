export const STORAGE_KEYS = {
  currentUser: 'current-user',
  accessToken: 'access-token',
  personalUtilities: 'personal-utilities',
  organizationUtilities: 'organization-utilities',
};

export const PERSONAL_UTILITY_KEYS = {
  receiptPaymentSelf: 'receipt-payment-self',
  receiptPaymentProjectSelf: 'receipt-payment-project-self',
  receiptPaymentProjectCompany: 'receipt-payment-project-company',
} as const;
export type PersonalUtilityKey =
  (typeof PERSONAL_UTILITY_KEYS)[keyof typeof PERSONAL_UTILITY_KEYS];
