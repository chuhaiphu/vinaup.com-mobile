import { CreateSocialLinkRequest, SocialLinkResponse, UpdateSocialLinkRequest } from "@/interfaces/social-link-interfaces";
import { api } from "./_base";

export async function createSocialLinkApi(data: CreateSocialLinkRequest) {
  return api<SocialLinkResponse>('/social-link', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSocialLinkApi(
  id: string,
  data: UpdateSocialLinkRequest,
) {
  return api<SocialLinkResponse>(`/social-link/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSocialLinkApi(id: string) {
  return api<null>(`/social-link/${id}`, {
    method: 'DELETE',
  });
}

export async function getSocialLinkByIdApi(id: string) {
  return api<SocialLinkResponse>(`/social-link/${id}`, {
    method: 'GET',
  });
}

export async function getSocialLinksByOrganizationIdApi(organizationId: string) {
  return api<SocialLinkResponse[]>(`/social-link/organization/${organizationId}`, {
    method: 'GET',
  });
}

export async function getSocialLinksByUserIdApi(userId: string) {
  return api<SocialLinkResponse[]>(`/social-link/user/${userId}`, {
    method: 'GET',
  });
}
