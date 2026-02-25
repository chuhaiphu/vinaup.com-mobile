export const ProjectStatus = {
  PROCESSING: 'PROCESSING',
  DONE: 'DONE',
  PAID: 'PAID',
  PENDING: 'PENDING',
  SHIPPING: 'SHIPPING',
  RECEIVED: 'RECEIVED',
  CANCELLED: 'CANCELLED',
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const ProjectType = {
  COMPANY: 'COMPANY',
  SELF: 'SELF',
  ORGANIZATION: 'ORGANIZATION',
} as const;
export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType];

export const ProjectStatusDisplayMap: Record<ProjectStatus, string> = {
  [ProjectStatus.PROCESSING]: 'Đang xử lý',
  [ProjectStatus.DONE]: 'Hoàn tất',
  [ProjectStatus.PAID]: 'Đã thanh toán',
  [ProjectStatus.PENDING]: 'Chờ duyệt',
  [ProjectStatus.SHIPPING]: 'Đang giao',
  [ProjectStatus.RECEIVED]: 'Đã nhận',
  [ProjectStatus.CANCELLED]: 'Đã hủy',
};