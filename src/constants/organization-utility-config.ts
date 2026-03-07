export const ORG_UTILITY_KEYS = {
  receiptPayment: 'receipt-payment',
  project: 'project',
  invoice: 'invoice',
  customer: 'customer',
  member: 'member',
  booking: 'booking',
  tour: 'tour',
  car: 'car',
} as const;

export type OrgUtilityKey =
  (typeof ORG_UTILITY_KEYS)[keyof typeof ORG_UTILITY_KEYS];

const GENERAL_UTILITIES: OrgUtilityKey[] = [
  ORG_UTILITY_KEYS.receiptPayment,
  ORG_UTILITY_KEYS.project,
  ORG_UTILITY_KEYS.invoice,
  ORG_UTILITY_KEYS.customer,
  ORG_UTILITY_KEYS.member,
];

export const UTILITIES_BY_INDUSTRY: Record<string, OrgUtilityKey[]> = {
  GENERAL: GENERAL_UTILITIES,
  TOURISM: [...GENERAL_UTILITIES, ORG_UTILITY_KEYS.tour, ORG_UTILITY_KEYS.booking],
  HOTEL: [...GENERAL_UTILITIES, ORG_UTILITY_KEYS.booking],
  RESTAURANT: GENERAL_UTILITIES,
  CAR_RENTAL: [...GENERAL_UTILITIES, ORG_UTILITY_KEYS.car, ORG_UTILITY_KEYS.booking],
  BEAUTY_SALON: [...GENERAL_UTILITIES, ORG_UTILITY_KEYS.booking],
  CONSTRUCTION: GENERAL_UTILITIES,
  SHOP: GENERAL_UTILITIES,
  ELECTRONICS: GENERAL_UTILITIES,
};

export function getAvailableUtilities(industryCode: string): OrgUtilityKey[] {
  return UTILITIES_BY_INDUSTRY[industryCode] ?? GENERAL_UTILITIES;
}
