export const BOOKING_STATUS = {
  PROCESSING: 'PROCESSING',
  DONE: 'DONE',
  PAID: 'PAID',
  PENDING: 'PENDING',
  SHIPPING: 'SHIPPING',
  RECEIVED: 'RECEIVED',
  CANCELLED: 'CANCELLED',
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const BookingStatusDisplay: Record<BookingStatus, string> = {
  [BOOKING_STATUS.PROCESSING]: 'Đang xử lý',
  [BOOKING_STATUS.DONE]: 'Hoàn tất',
  [BOOKING_STATUS.PAID]: 'Đã thanh toán',
  [BOOKING_STATUS.PENDING]: 'Chờ duyệt',
  [BOOKING_STATUS.SHIPPING]: 'Đang giao',
  [BOOKING_STATUS.RECEIVED]: 'Đã nhận',
  [BOOKING_STATUS.CANCELLED]: 'Đã hủy',
};

export const BookingStatusOptions: { value: BookingStatus; label: string }[] = [
  { value: BOOKING_STATUS.PROCESSING, label: BookingStatusDisplay.PROCESSING },
  { value: BOOKING_STATUS.DONE, label: BookingStatusDisplay.DONE },
  { value: BOOKING_STATUS.PAID, label: BookingStatusDisplay.PAID },
  { value: BOOKING_STATUS.PENDING, label: BookingStatusDisplay.PENDING },
  { value: BOOKING_STATUS.SHIPPING, label: BookingStatusDisplay.SHIPPING },
  { value: BOOKING_STATUS.RECEIVED, label: BookingStatusDisplay.RECEIVED },
  { value: BOOKING_STATUS.CANCELLED, label: BookingStatusDisplay.CANCELLED },
];
