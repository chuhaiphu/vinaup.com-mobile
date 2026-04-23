import { OrganizationResponse } from './organization-interfaces';
import { UserResponse } from './user-interfaces';
import { OrganizationCustomerResponse } from './organization-customer-interfaces';
import { ProjectStatus, ProjectType } from '@/constants/project-constants';

export interface ProjectResponse {
  id: string;
  type: ProjectType;
  code: string;
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
  type: ProjectType;
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
