import { OrganizationRoleResponse } from '@/interfaces/organization-role-interfaces';
import { wireApi } from 'fetchwire';

export async function getOrganizationRolesByOrganizationIdApi(
    organizationId: string
) {
    return wireApi<OrganizationRoleResponse[]>(
        `/organization-role/by-organization/${organizationId}`,
        {
            method: 'GET',
        }
    );
}
