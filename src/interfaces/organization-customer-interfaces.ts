import { OrganizationResponse } from "./organization-interfaces";
import { UserResponse } from "./user-interfaces";

export interface OrganizationCustomerResponse {
  id: string;
  organizationId: string;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  joinedAt: Date;
  createdBy: UserResponse;
  clientUser: UserResponse | null;
  clientOrganization: OrganizationResponse | null;
  organization: OrganizationResponse;
}

export interface CreateOrganizationCustomerRequest {
  organizationId: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  joinedAt: Date;
  clientUserId?: string;
  clientOrganizationId?: string;
}

export type UpdateOrganizationCustomerRequest = Partial<CreateOrganizationCustomerRequest>;
