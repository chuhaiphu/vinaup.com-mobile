import { UserResponse } from './user-interfaces';
import { TourResponse } from './tour-interfaces';
import { OrganizationMemberResponse } from './organization-member-interfaces';

export interface UpdateTourImplementationRequest {
  description?: string;
  adultTicketCount?: number;
  childTicketCount?: number;
  adultTicketPrice?: number;
  childTicketPrice?: number;
  taxRate?: number;
}
export interface TourImplementationResponse {
  id: string;
  adultTicketCount: number;
  childTicketCount: number;
  adultTicketPrice: number;
  childTicketPrice: number;
  taxRate: number;
  description: string;
  createdBy: UserResponse | null;
  tour: TourResponse;
  membersInCharge: MemberInChargeTourImplementationResponse[];
  additionalData: TourImplementationAdditionalDataResponse[];
  tourImplementationReceiptPayments: {
    id: string;
    tourImplementationId: string;
    receiptPaymentId: string;
    groupCode: string;
  }[];
}

export interface CreateMemberInChargeRequest {
  organizationMemberId: string;
  role: string;
}
export interface ManageMembersInChargeRequest {
  organizationMemberIds: string[];
}
export interface MemberInChargeTourImplementationResponse {
  id: string;
  tourImplementationId: string | null;
  organizationMemberId: string | null;
  organizationMember: OrganizationMemberResponse | null;
  role: string;
}

export interface CreateUserInvitedRequest {
  userId?: string | null;
  role: string;
  tourImplementationAdditionalDataId: string;
  customUserName?: string;
  customPhone?: string;
  permissions?: string[];
}
export type UpdateUserInvitedRequest = Partial<CreateUserInvitedRequest> & {
  currentOption?: number;
};
export interface UserInvitedTourImplementationResponse {
  id: string;
  userId: string | null;
  role: string;
  tourImplementationAdditionalDataId: string | null;
  user: UserResponse | null;
  customUserName: string | null;
  customPhone: string | null;
  currentOption: number;
  permissions: string[];
}

export interface UpdateTourImplementationAdditionalDataRequest {
  carName?: string;
  position?: number;
}
export interface TourImplementationAdditionalDataResponse {
  id: string;
  tourImplementationId: string;
  carName: string | null;
  createdAt: string;
  usersInvited: UserInvitedTourImplementationResponse[];
  position: number;
}
