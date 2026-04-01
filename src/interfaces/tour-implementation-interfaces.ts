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
  createdBy: UserResponse;
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
  organizationMemberId: string;
  organizationMember: OrganizationMemberResponse;
  role: string;
}

export interface CreateUserInvitedRequest {
  userId?: string | null;
  organizationMemberId?: string | null;
  role: string;
  tourImplementationAdditionalDataId: string;
  customUserName?: string;
}
export type UpdateUserInvitedRequest = Partial<CreateUserInvitedRequest> & {
  currentOption?: number;
};
export interface UserInvitedTourImplementationResponse {
  id: string;
  userId: string | null;
  role: string;
  tourImplementationAdditionalDataId: string | null;
  organizationMember: OrganizationMemberResponse | null;
  user: UserResponse | null;
  customUserName: string | null;
  currentOption: number;
}

export interface CreateTourImplementationAdditionalDataRequest {
  position: number;
  carName?: string;
}

export type UpdateTourImplementationAdditionalDataRequest =
  Partial<CreateTourImplementationAdditionalDataRequest>;
export interface TourImplementationAdditionalDataResponse {
  id: string;
  tourImplementationId: string;
  carName: string | null;
  createdAt: Date;
  usersInvited: UserInvitedTourImplementationResponse[];
  position: number;
}
