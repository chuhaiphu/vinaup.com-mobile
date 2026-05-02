export const DD_MM_DATE_FORMAT_SHORT = 'DD/MM';

export const STORAGE_KEYS = {
  currentUser: 'current-user',
  accessToken: 'access-token',
  personalUtilities: 'personal-utilities',
  organizationUtilities: 'organization-utilities',
};

/**
 * Personal utilities
 */
export const PERSONAL_UTILITY_KEYS = {
  receiptPayment: 'receipt-payment',
  projectCompany: 'project-company',
} as const;
export type PersonalUtilityKey =
  (typeof PERSONAL_UTILITY_KEYS)[keyof typeof PERSONAL_UTILITY_KEYS];

/**
 * Organization utilities
 */
export const ORG_UTILITY_KEYS = {
  receiptPaymentReceipt: 'receipt-payment-receipt',
  receiptPaymentPayment: 'receipt-payment-payment',
  booking: 'booking',
} as const;

export type OrgUtilityKey =
  (typeof ORG_UTILITY_KEYS)[keyof typeof ORG_UTILITY_KEYS];

const GENERAL_UTILITIES: OrgUtilityKey[] = [
  ORG_UTILITY_KEYS.receiptPaymentReceipt,
  ORG_UTILITY_KEYS.receiptPaymentPayment,
  ORG_UTILITY_KEYS.booking,
];

export const UTILITIES_BY_INDUSTRY: Record<string, OrgUtilityKey[]> = {
  GENERAL: GENERAL_UTILITIES,
  TOURISM: [...GENERAL_UTILITIES],
  HOTEL: [...GENERAL_UTILITIES],
  RESTAURANT: GENERAL_UTILITIES,
  CAR_RENTAL: [...GENERAL_UTILITIES],
  BEAUTY_SALON: [...GENERAL_UTILITIES],
  CONSTRUCTION: GENERAL_UTILITIES,
  SHOP: GENERAL_UTILITIES,
  ELECTRONICS: GENERAL_UTILITIES,
};
