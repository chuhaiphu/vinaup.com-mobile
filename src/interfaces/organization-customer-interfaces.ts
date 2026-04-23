import { OrganizationResponse } from './organization-interfaces';
import { UserResponse } from './user-interfaces';

export interface OrganizationCustomerResponse {
  id: string;
  organizationId: string;
  createdByUserId: string | null;
  createdBy: UserResponse | null;
  clientUserId: string | null;
  clientUser: UserResponse | null;
  clientOrganizationId: string | null;
  clientOrganization: OrganizationResponse | null;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  isSystemDefault: boolean;
  joinedAt: string;
  organization: OrganizationResponse;
}

export interface CreateOrganizationCustomerRequest {
  organizationId: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  joinedAt: string;
  clientUserId?: string;
  clientOrganizationId?: string;
}

export type UpdateOrganizationCustomerRequest = Omit<
  Partial<CreateOrganizationCustomerRequest>,
  'clientUserId' | 'clientOrganizationId'
> & {
  clientUserId?: string | null;
  clientOrganizationId: string | null;
};
