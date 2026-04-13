import { OrganizationResponse } from './organization-interfaces';
import { UserResponse } from './user-interfaces';
import { OrganizationCustomerResponse } from './organization-customer-interfaces';
import { ProjectStatus, ProjectType } from '@/constants/project-constants';

export interface ProjectResponse {
  id: string;
  type: ProjectType;
  code: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  note: string | null;
  createdBy: UserResponse | null;
  externalOrganizationName: string | null;
  externalCustomerName: string | null;
  organization: OrganizationResponse | null;
  organizationCustomer: OrganizationCustomerResponse | null;
}

export interface CreateProjectRequest {
  type: ProjectType;
  description: string;
  endDate: Date;
  startDate?: Date;
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
