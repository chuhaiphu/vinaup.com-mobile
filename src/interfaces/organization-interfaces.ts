import { OrganizationIndustryResponse } from './organization-industry-interfaces';
import { UserResponse } from './user-interfaces';

export interface CreateOrganizationRequest {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  province: string;
  website?: string;
  avatarUrl?: string;
  organizationIndustryId: string;
}

export type UpdateOrganizationRequest = Partial<CreateOrganizationRequest> & {
  description?: string;
};

export interface OrganizationResponse {
  id: string;
  name: string;
  description?: string | null;
  email: string | null;
  phone: string;
  address: string | null;
  website: string | null;
  avatarUrl: string | null;
  province: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserResponse | null;
  organizationIndustry: OrganizationIndustryResponse;
  memberCount?: number;
  memberLinkedCount?: number;
}
