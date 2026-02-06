import { SocialLinkPlatform } from "@/constants/social-link-constants";
import { OrganizationResponse } from "./organization-interfaces";
import { UserResponse } from "./user-interfaces";

export interface SocialLinkResponse {
  id: string;
  description: string | null;
  platform: SocialLinkPlatform;
  url: string;
  user: UserResponse | null;
  organization: OrganizationResponse | null;
  createdBy: UserResponse | null;
}

export interface CreateSocialLinkRequest {
  platform: SocialLinkPlatform;
  url: string;
  description?: string;
  userId?: string;
  organizationId?: string;
}

export type UpdateSocialLinkRequest = Partial<CreateSocialLinkRequest>;
