import { OrganizationResponse } from './organization-interfaces';
import { UserResponse } from './user-interfaces';
import { OrganizationCustomerResponse } from './organization-customer-interfaces';
import { ProjectStatus } from '@/constants/project-constants';

export interface ProjectResponse {
  id: string;
  type: string | null;
  code: string | null;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  note: string | null;
  createdByUserId: string | null;
  createdBy: UserResponse | null;
  organizationId: string | null;
  organization: OrganizationResponse | null;
  organizationCustomerId: string | null;
  organizationCustomer: OrganizationCustomerResponse | null;
  externalOrganizationName: string | null;
  externalCustomerName: string | null;
}

export interface CreateProjectRequest {
  code?: string;
  type?: string;
  description: string;
  endDate: string;
  startDate?: string;
  note?: string;
  organizationId?: string;
  organizationCustomerId?: string | null;
  externalOrganizationName?: string;
  externalCustomerName?: string | null;
}

export type UpdateProjectRequest = Partial<CreateProjectRequest> & {
  status?: ProjectStatus;
  code?: string;
};
