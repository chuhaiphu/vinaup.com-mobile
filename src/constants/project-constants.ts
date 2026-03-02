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

export const ProjectStatusDisplay: Record<ProjectStatus, string> = {
  [ProjectStatus.PROCESSING]: 'Đang xử lý',
  [ProjectStatus.DONE]: 'Hoàn tất',
  [ProjectStatus.PAID]: 'Đã thanh toán',
  [ProjectStatus.PENDING]: 'Chờ duyệt',
  [ProjectStatus.SHIPPING]: 'Đang giao',
  [ProjectStatus.RECEIVED]: 'Đã nhận',
  [ProjectStatus.CANCELLED]: 'Đã hủy',
};

export const ProjectStatusOptions: { value: ProjectStatus; label: string }[] = [
  { value: ProjectStatus.PROCESSING, label: ProjectStatusDisplay.PROCESSING },
  { value: ProjectStatus.DONE, label: ProjectStatusDisplay.DONE },
  { value: ProjectStatus.PAID, label: ProjectStatusDisplay.PAID },
  { value: ProjectStatus.PENDING, label: ProjectStatusDisplay.PENDING },
  { value: ProjectStatus.SHIPPING, label: ProjectStatusDisplay.SHIPPING },
  { value: ProjectStatus.RECEIVED, label: ProjectStatusDisplay.RECEIVED },
  { value: ProjectStatus.CANCELLED, label: ProjectStatusDisplay.CANCELLED },
];
