export const TOUR_STATUS = {
  NOT_COMPLETED: 'NOT_COMPLETED',
  COMPLETED: 'COMPLETED',
} as const;
export type TourStatus = (typeof TOUR_STATUS)[keyof typeof TOUR_STATUS];

export const TourStatusDisplay: Record<TourStatus, string> = {
  [TOUR_STATUS.NOT_COMPLETED]: 'Chưa xong',
  [TOUR_STATUS.COMPLETED]: 'Đã xong',
};

export const TourStatusOptions: { value: TourStatus; label: string }[] = [
  { value: TOUR_STATUS.NOT_COMPLETED, label: TourStatusDisplay[TOUR_STATUS.NOT_COMPLETED] },
  { value: TOUR_STATUS.COMPLETED, label: TourStatusDisplay[TOUR_STATUS.COMPLETED] },
];

export const USER_INVITED_OPTION = {
  TEXT_INPUT: 0,
  ORGANIZATION_MEMBER: 1,
  ACCOUNT: 2,
} as const;
export type UserInvitedOption =
  (typeof USER_INVITED_OPTION)[keyof typeof USER_INVITED_OPTION];

