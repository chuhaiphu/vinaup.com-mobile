import { OrganizationMemberStatus, OrganizationMemberType } from "@/constants/organization-constants";
import { OrganizationResponse } from "./organization-interfaces";
import { OrganizationRoleResponse } from "./organization-role-interfaces";
import { UserResponse } from "./user-interfaces";

export interface OrganizationMemberResponse {
  id: string;
  organizationId: string;
  type: OrganizationMemberType;
  name: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  address: string | null;
  status: OrganizationMemberStatus;
  joinedAt: Date;
  organizationRoleId: string;
  createdBy: UserResponse | null;
  user: UserResponse | null;
  organization: OrganizationResponse;
  organizationRole: OrganizationRoleResponse;
}

export interface CreateOrganizationMemberRequest {
  organizationId: string;
  type: OrganizationMemberType;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  address?: string;
  status: OrganizationMemberStatus;
  joinedAt: Date;
  organizationRoleId: string;
  userId?: string | null;
}

export type UpdateOrganizationMemberRequest = Partial<CreateOrganizationMemberRequest>;


export interface DeleteOrganizationMemberRequest {
  organizationId: string;
}