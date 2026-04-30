import {
  CreateInvoiceRequest,
  InvoiceResponse,
  UpdateInvoiceRequest,
} from '@/interfaces/invoice-interfaces';
import { InvoiceFilterParam } from '@/interfaces/_query-param.interfaces';
import { wireApi } from 'fetchwire';
import { InvoiceTypeResponse } from '@/interfaces/invoice-type-interfaces';
import { buildFilterQueryString } from '@/utils/api-helpers';

export async function createInvoiceApi(data: CreateInvoiceRequest) {
  return wireApi<InvoiceResponse>(`/invoice`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateInvoiceApi(id: string, data: UpdateInvoiceRequest) {
  return wireApi<InvoiceResponse>(`/invoice/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getInvoiceTypesApi() {
  return wireApi<InvoiceTypeResponse[]>(`/invoice/types`, {
    method: 'GET',
  });
}

export async function getInvoiceByIdApi(id: string) {
  return wireApi<InvoiceResponse>(`/invoice/${id}`, {
    method: 'GET',
  });
}

export async function getInvoicesByOrganizationIdApi(
  organizationId: string,
  filter?: InvoiceFilterParam
) {
  const filterQueryString = buildFilterQueryString(filter, {
    invoiceTypeId: filter?.invoiceTypeId,
    status: filter?.status,
  });
  return wireApi<InvoiceResponse[]>(
    `/invoice/organization/${organizationId}${filterQueryString}`,
    {
      method: 'GET',
    }
  );
}

export async function deleteInvoiceApi(id: string) {
  return wireApi<void>(`/invoice/${id}`, {
    method: 'DELETE',
  });
}
