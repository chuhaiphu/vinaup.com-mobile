export const CarStatus = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
} as const;

export type CarStatus = (typeof CarStatus)[keyof typeof CarStatus];

export const CarAssignmentStatus = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
} as const;

export type CarAssignmentStatus = (typeof CarAssignmentStatus)[keyof typeof CarAssignmentStatus];
