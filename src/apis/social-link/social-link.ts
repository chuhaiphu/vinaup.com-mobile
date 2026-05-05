import {
    CreateSocialLinkRequest,
    SocialLinkResponse,
    UpdateSocialLinkRequest,
} from '@/interfaces/social-link-interfaces';
import { wireApi } from 'fetchwire';

export async function createSocialLinkApi(data: CreateSocialLinkRequest) {
    return wireApi<SocialLinkResponse>('/social-link', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateSocialLinkApi(
    id: string,
    data: UpdateSocialLinkRequest
) {
    return wireApi<SocialLinkResponse>(`/social-link/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteSocialLinkApi(id: string) {
    return wireApi<void>(`/social-link/${id}`, {
        method: 'DELETE',
    });
}

export async function getSocialLinkByIdApi(id: string) {
    return wireApi<SocialLinkResponse>(`/social-link/${id}`, {
        method: 'GET',
    });
}

export async function getSocialLinksByOrganizationIdApi(organizationId: string) {
    return wireApi<SocialLinkResponse[]>(
        `/social-link/organization/${organizationId}`,
        {
            method: 'GET',
        }
    );
}

export async function getSocialLinksByUserIdApi(userId: string) {
    return wireApi<SocialLinkResponse[]>(`/social-link/user/${userId}`, {
        method: 'GET',
    });
}
