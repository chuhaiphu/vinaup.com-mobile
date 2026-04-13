import { OrganizationResponse } from './organization-interfaces';
import { UserResponse } from './user-interfaces';

export interface OrganizationCustomerResponse {
  id: string;
  organizationId: string;
  clientUserId: string | null;
  clientOrganizationId: string | null;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  isSystemDefault: boolean;
  joinedAt: Date;
  createdBy: UserResponse | null;
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

export type UpdateOrganizationCustomerRequest = Omit<
  Partial<CreateOrganizationCustomerRequest>,
  'clientUserId' | 'clientOrganizationId'
> & {
  clientUserId?: string | null;
  clientOrganizationId: string | null;
};
