export const DOCUMENT_TYPES = {
  PROJECT: 'PROJECT',
  TOUR_CALCULATION: 'TOUR_CALCULATION',
  TOUR_SETTLEMENT: 'TOUR_SETTLEMENT',
  INVOICE: 'INVOICE',
  BOOKING: 'BOOKING',
} as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

export const SIGNATURE_ROLES = {
  SENDER: 'SENDER',
  RECEIVER: 'RECEIVER',
} as const;
export type SignatureRole = (typeof SIGNATURE_ROLES)[keyof typeof SIGNATURE_ROLES];
