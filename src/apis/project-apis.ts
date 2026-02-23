import { CreateProjectRequest, ProjectResponse, UpdateProjectRequest } from "@/interfaces/project-interfaces";
import { ProjectFilterParam } from "@/interfaces/_query-param.interfaces";
import { api } from "./_base";
import { buildFilterQueryString } from "@/utils/api-helpers";

export async function createProjectApi(data: CreateProjectRequest) {
  return api<ProjectResponse>('/project', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProjectsOfCurrentUserApi(filter?: ProjectFilterParam) {
  const filterQueryString = buildFilterQueryString(filter, {
    type: filter?.type,
    status: filter?.status
  });
  return api<ProjectResponse[]>(`/project${filterQueryString}`, {
    method: 'GET',
  });
}

export async function getProjectsOfByOrganizationIdApi(organizationId: string, filter?: ProjectFilterParam) {
  const filterQueryString = buildFilterQueryString(filter, {
    type: filter?.type,
    status: filter?.status
  });
  return api<ProjectResponse[]>(`/project/organization/${organizationId}${filterQueryString}`, {
    method: 'GET',
  });
}

export async function updateProjectApi(id: string, data: UpdateProjectRequest) {
  return api<ProjectResponse>(`/project/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProjectApi(id: string) {
  return api<null>(`/project/${id}`, {
    method: 'DELETE',
  });
}

export async function getProjectByIdApi(id: string) {
  return api<ProjectResponse>(`/project/${id}`, {
    method: 'GET',
  });
}
