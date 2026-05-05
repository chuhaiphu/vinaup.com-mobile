import {
    CreateProjectRequest,
    ProjectResponse,
    UpdateProjectRequest,
} from '@/interfaces/project-interfaces';
import { ProjectFilterParam } from '@/interfaces/_query-param.interfaces';
import { wireApi } from 'fetchwire';
import { generateFilterQueryString } from '@/utils/generator/string-generator/generate-filter-query-string';

export async function createProjectApi(data: CreateProjectRequest) {
    return wireApi<ProjectResponse>('/project', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getProjectsOfCurrentUserApi(filter?: ProjectFilterParam) {
    const filterQueryString = generateFilterQueryString(filter, {
        type: filter?.type,
        status: filter?.status,
    });
    return wireApi<ProjectResponse[]>(`/project${filterQueryString}`, {
        method: 'GET',
    });
}

export async function getProjectsOfByOrganizationIdApi(
    organizationId: string,
    filter?: ProjectFilterParam
) {
    const filterQueryString = generateFilterQueryString(filter, {
        type: filter?.type,
        status: filter?.status,
    });
    return wireApi<ProjectResponse[]>(
        `/project/organization/${organizationId}${filterQueryString}`,
        {
            method: 'GET',
        }
    );
}

export async function updateProjectApi(id: string, data: UpdateProjectRequest) {
    return wireApi<ProjectResponse>(`/project/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteProjectApi(id: string) {
    return wireApi<void>(`/project/${id}`, {
        method: 'DELETE',
    });
}

export async function getProjectByIdApi(id: string) {
    return wireApi<ProjectResponse>(`/project/${id}`, {
        method: 'GET',
    });
}
