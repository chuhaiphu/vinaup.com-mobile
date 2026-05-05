import {
    CreateOrganizationCustomerRequest,
    OrganizationCustomerResponse,
    UpdateOrganizationCustomerRequest,
} from '@/interfaces/organization-customer-interfaces';
import { wireApi } from 'fetchwire';

export async function createOrganizationCustomerApi(
    data: CreateOrganizationCustomerRequest
) {
    return wireApi<OrganizationCustomerResponse>(
        '/organization-customer',
        {
            method: 'POST',
            body: JSON.stringify(data),
        }
    );
}

export async function getOrganizationCustomersByOrganizationIdApi(
    organizationId: string
) {
    return wireApi<OrganizationCustomerResponse[]>(
        `/organization-customer/by-organization/${organizationId}`,
        {
            method: 'GET',
        }
    );
}

export async function updateOrganizationCustomerApi(
    id: string,
    data: UpdateOrganizationCustomerRequest
) {
    return wireApi<OrganizationCustomerResponse>(
        `/organization-customer/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(data),
        }
    );
}
