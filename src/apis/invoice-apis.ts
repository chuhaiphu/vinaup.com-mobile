import { CreateInvoiceRequest, InvoiceResponse, UpdateInvoiceRequest } from "@/interfaces/invoice-interfaces";
import { InvoiceFilterParam } from "@/interfaces/_query-param.interfaces";
import { api } from "./_base";
import { InvoiceTypeResponse } from "@/interfaces/invoice-type-interfaces";
import { buildFilterQueryString } from "@/utils/api-helpers";

export async function createInvoiceApi(data: CreateInvoiceRequest) {
  return api<InvoiceResponse>(`/invoice`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateInvoiceApi(id: string, data: UpdateInvoiceRequest) {
  return api<InvoiceResponse>(`/invoice/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function getInvoiceTypesApi() {
  return api<InvoiceTypeResponse[]>(`/invoice/types`, {
    method: 'GET'
  })
}

export async function getInvoiceByIdApi(id: string) {
  return api<InvoiceResponse>(`/invoice/${id}`, {
    method: 'GET'
  })
}

export async function getInvoicesByOrganizationIdApi(organizationId: string, filter?: InvoiceFilterParam) {
  const filterQueryString = buildFilterQueryString(filter, {
    invoiceTypeId: filter?.invoiceTypeId,
    status: filter?.status,
  });
  return api<InvoiceResponse[]>(`/invoice/organization/${organizationId}${filterQueryString}`, {
    method: 'GET'
  })
}

export async function deleteInvoiceApi(id: string) {
  return api<null>(`/invoice/${id}`, {
    method: 'DELETE',
  });
}
