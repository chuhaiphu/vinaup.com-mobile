import {
    CreateOrganizationMemberRequest,
    DeleteOrganizationMemberRequest,
    OrganizationMemberResponse,
    UpdateOrganizationMemberRequest,
} from '@/interfaces/organization-member-interfaces';
import { wireApi } from 'fetchwire';

export async function createOrganizationMemberApi(
    data: CreateOrganizationMemberRequest
) {
    return wireApi<OrganizationMemberResponse>('/organization-member', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateOrganizationMemberApi(
    id: string,
    data: Partial<UpdateOrganizationMemberRequest>
) {
    return wireApi<OrganizationMemberResponse>(
        `/organization-member/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(data),
        }
    );
}

export async function deleteOrganizationMemberApi(
    id: string,
    data: DeleteOrganizationMemberRequest
) {
    return wireApi<void>(`/organization-member/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(data),
    });
}

export async function getOrganizationMembersByOrganizationIdApi(
    organizationId: string
) {
    return wireApi<OrganizationMemberResponse[]>(
        `/organization-member?organizationId=${organizationId}`,
        {
            method: 'GET',
        }
    );
}

export async function getOrganizationMemberByIdApi(id: string) {
    return wireApi<OrganizationMemberResponse>(
        `/organization-member/${id}`,
        {
            method: 'GET',
        }
    );
}
