import { wireApi } from 'fetchwire';
import { ReceiptPaymentFilterParam } from '@/interfaces/_query-param.interfaces';
import {
  CreateReceiptPaymentRequest,
  ReceiptPaymentResponse,
  UpdateReceiptPaymentRequest,
} from '@/interfaces/receipt-payment-interfaces';
import { buildFilterQueryString } from '@/utils/api-helpers';

export async function createReceiptPaymentApi(data: CreateReceiptPaymentRequest) {
  return wireApi<ReceiptPaymentResponse>('/receipt-payment', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getReceiptPaymentsByCurrentUserApi(
  filter?: ReceiptPaymentFilterParam
) {
  const filterQueryString = buildFilterQueryString(filter, { type: filter?.type });
  console.log('filterQueryString', filterQueryString);
  return wireApi<ReceiptPaymentResponse[]>(`/receipt-payment${filterQueryString}`, {
    method: 'GET',
  });
}

export async function updateReceiptPaymentApi(
  id: string,
  data: UpdateReceiptPaymentRequest
) {
  return wireApi<ReceiptPaymentResponse>(`/receipt-payment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteReceiptPaymentApi(id: string) {
  return wireApi<null>(`/receipt-payment/${id}`, {
    method: 'DELETE',
  });
}

export async function getReceiptPaymentByIdApi(id: string) {
  return wireApi<ReceiptPaymentResponse>(`/receipt-payment/${id}`, {
    method: 'GET',
  });
}

export async function getReceiptPaymentsByProjectIdsApi(projectIds: string[]) {
  return wireApi<ReceiptPaymentResponse[]>('/receipt-payment/projects', {
    method: 'POST',
    body: JSON.stringify({ projectIds }),
  });
}

export async function getReceiptPaymentsByProjectIdApi(projectId: string) {
  return wireApi<ReceiptPaymentResponse[]>(
    `/receipt-payment/project/${projectId}`,
    {
      method: 'GET',
    }
  );
}

export async function getReceiptPaymentsByInvoiceIdApi(invoiceId: string) {
  return wireApi<ReceiptPaymentResponse[]>(
    `/receipt-payment/invoice/${invoiceId}`,
    {
      method: 'GET',
    }
  );
}

export async function getReceiptPaymentsByInvoiceIdsApi(invoiceIds: string[]) {
  return wireApi<ReceiptPaymentResponse[]>('/receipt-payment/invoices', {
    method: 'POST',
    body: JSON.stringify({ invoiceIds }),
  });
}

export async function getReceiptPaymentsByTourCalculationIdApi(
  tourCalculationId: string
) {
  return wireApi<ReceiptPaymentResponse[]>(
    `/receipt-payment/tour-calculation/${tourCalculationId}`,
    {
      method: 'GET',
    }
  );
}

export async function getReceiptPaymentsByTourImplementationIdApi(
  tourImplementationId: string
) {
  return wireApi<ReceiptPaymentResponse[]>(
    `/receipt-payment/tour-implementation/${tourImplementationId}`,
    {
      method: 'GET',
    }
  );
}

export async function getReceiptPaymentsByTourSettlementIdApi(
  tourSettlementId: string
) {
  return wireApi<ReceiptPaymentResponse[]>(
    `/receipt-payment/tour-settlement/${tourSettlementId}`,
    {
      method: 'GET',
    }
  );
}

export async function getReceiptPaymentsByBookingIdApi(bookingId: string) {
  return wireApi<ReceiptPaymentResponse[]>(
    `/receipt-payment/booking/${bookingId}`,
    {
      method: 'GET',
    }
  );
}

export async function getReceiptPaymentsByOrganizationIdApi(
  organizationId: string,
  filter?: ReceiptPaymentFilterParam
) {
  const filterQueryString = buildFilterQueryString(filter, { type: filter?.type });
  return wireApi<ReceiptPaymentResponse[]>(
    `/receipt-payment/organization/${organizationId}${filterQueryString}`,
    {
      method: 'GET',
    }
  );
}
