export interface UserConfiguration {
  [key: string]: unknown;
}

export interface OrganizationResponse {
  id: string;
  [key: string]: unknown;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  userConfiguration: UserConfiguration | null;
  currentOwner?: UserResponse | OrganizationResponse;
}