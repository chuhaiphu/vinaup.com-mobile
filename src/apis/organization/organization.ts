import {
    CreateOrganizationRequest,
    OrganizationResponse,
    UpdateOrganizationRequest,
} from '@/interfaces/organization-interfaces';
import { OrganizationIndustryResponse } from '@/interfaces/organization-industry-interfaces';
import { wireApi } from 'fetchwire';

export async function getOrganizationsOfCurrentUserApi() {
    return wireApi<OrganizationResponse[]>('/organization', {
        method: 'GET',
    });
}

export async function getOrganizationByIdApi(id: string) {
    return wireApi<OrganizationResponse>(`/organization/${id}`, {
        method: 'GET',
    });
}

export async function getAllOrganizationsApi() {
    return wireApi<OrganizationResponse[]>('/organization/all', {
        method: 'GET',
    });
}

export async function getOrganizationIndustriesApi() {
    return wireApi<OrganizationIndustryResponse[]>('/organization/industries', {
        method: 'GET',
    });
}

export async function createOrganizationApi(data: CreateOrganizationRequest) {
    return wireApi<OrganizationResponse>('/organization', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateOrganizationApi(
    id: string,
    data: UpdateOrganizationRequest
) {
    return wireApi<OrganizationResponse>(`/organization/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteOrganizationApi(id: string) {
    return wireApi<void>(`/organization/${id}`, {
        method: 'DELETE',
    });
}
