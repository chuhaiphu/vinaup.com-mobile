export const BOOKING_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  RECEIVER_SIGNED: 'RECEIVER_SIGNED',
  COMPLETED: 'COMPLETED',
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const BookingStatusDisplay: Record<BookingStatus, string> = {
  [BOOKING_STATUS.DRAFT]: 'Nháp',
  [BOOKING_STATUS.SENT]: 'Đã gửi',
  [BOOKING_STATUS.RECEIVER_SIGNED]: 'Bên nhận đã ký',
  [BOOKING_STATUS.COMPLETED]: 'Hoàn tất',
};

export const BookingStatusOptions: { value: BookingStatus; label: string }[] = [
  { value: BOOKING_STATUS.DRAFT, label: BookingStatusDisplay.DRAFT },
  { value: BOOKING_STATUS.SENT, label: BookingStatusDisplay.SENT },
  { value: BOOKING_STATUS.RECEIVER_SIGNED, label: BookingStatusDisplay.RECEIVER_SIGNED },
  { value: BOOKING_STATUS.COMPLETED, label: BookingStatusDisplay.COMPLETED },
];

export const BOOKING_TYPE = {
  FROM: 'FROM',
  TO: 'TO',
} as const;

export type BookingType = (typeof BOOKING_TYPE)[keyof typeof BOOKING_TYPE];

export const BookingTypeDisplay: Record<BookingType, string> = {
  [BOOKING_TYPE.FROM]: 'Gửi đi',
  [BOOKING_TYPE.TO]: 'Nhận về',
};

export const BookingTypeOptions: { value: BookingType; label: string }[] = [
  { value: BOOKING_TYPE.FROM, label: BookingTypeDisplay.FROM },
  { value: BOOKING_TYPE.TO, label: BookingTypeDisplay.TO },
];
