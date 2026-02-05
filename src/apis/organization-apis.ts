import { CreateOrganizationRequest, OrganizationResponse, UpdateOrganizationRequest } from "@/interfaces/organization-interfaces";
import { CreateOrganizationCustomerRequest, OrganizationCustomerResponse } from "@/interfaces/organization-customer-interfaces";
import { CreateOrganizationMemberRequest, DeleteOrganizationMemberRequest, OrganizationMemberResponse, UpdateOrganizationMemberRequest } from "@/interfaces/organization-member-interfaces";
import { OrganizationTypeResponse } from "@/interfaces/organization-type-interfaces";
import { OrganizationIndustryResponse } from "@/interfaces/organization-industry-interfaces";
import { OrganizationRoleResponse } from "@/interfaces/organization-role-interfaces";
import { api } from "./_base";


export async function getOrganizationsOfCurrentUserApi() {
  return api<OrganizationResponse[]>('/organization', {
    method: 'GET',
  });
}

export async function getOrganizationByIdApi(id: string) {
  return api<OrganizationResponse>(`/organization/${id}`, {
    method: 'GET',
  });
}

export async function getOrganizationTypesApi() {
  return api<OrganizationTypeResponse[]>('/organization/types', {
    method: 'GET',
  });
}

export async function getOrganizationIndustriesApi() {
  return api<OrganizationIndustryResponse[]>('/organization/industries', {
    method: 'GET',
  });
}

export async function createOrganizationApi(data: CreateOrganizationRequest) {
  return api<OrganizationResponse>('/organization', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createOrganizationCustomerApi(data: CreateOrganizationCustomerRequest) {
  return api<OrganizationCustomerResponse>('/organization/organization-customer', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrganizationCustomersByOrganizationIdApi(organizationId: string) {
  return api<OrganizationCustomerResponse[]>(`/organization/organization-customer/${organizationId}`, {
    method: 'GET',
  });
}

export async function createOrganizationMemberApi(data: CreateOrganizationMemberRequest) {
  return api<OrganizationMemberResponse>('/organization/organization-member', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrganizationMemberApi(id: string, data: Partial<UpdateOrganizationMemberRequest>) {
  return api<OrganizationMemberResponse>(`/organization/organization-member/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteOrganizationMemberApi(id: string, data: DeleteOrganizationMemberRequest) {
  return api<void>(`/organization/organization-member/${id}`, {
    method: 'DELETE',
    body: JSON.stringify(data),
  });
}

export async function getOrganizationMembersByOrganizationIdApi(organizationId: string) {
  return api<OrganizationMemberResponse[]>(`/organization/organization-member?organizationId=${organizationId}`, {
    method: 'GET',
  });
}

export async function getOrganizationRolesByOrganizationIdApi(organizationId: string) {
  return api<OrganizationRoleResponse[]>(`/organization/organization-role/${organizationId}`, {
    method: 'GET',
  });
}

export async function getOrganizationMemberByIdApi(id: string) {
  return api<OrganizationMemberResponse>(`/organization/organization-member/${id}`, {
    method: 'GET',
  });
}

export async function updateOrganizationApi(id: string, data: UpdateOrganizationRequest) {
  return api<OrganizationResponse>(`/organization/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteOrganizationApi(id: string) {
  return api<void>(`/organization/${id}`, {
    method: 'DELETE',
  });
}