import { ProjectStatus, ProjectType } from '@/constants/project-constants';
import { OrganizationResponse } from './organization-interfaces';
import { UserResponse } from './user-interfaces';
import { OrganizationCustomerResponse } from './organization-customer-interfaces';

export interface ProjectResponse {
  id: string;
  type: ProjectType;
  code: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  note: string | null;
  createdBy: UserResponse;
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
};
