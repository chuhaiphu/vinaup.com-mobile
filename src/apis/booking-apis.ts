import {
  CreateBookingRequest,
  BookingResponse,
  UpdateBookingRequest,
  BookingMeta,
} from '@/interfaces/booking-interfaces';
import { BookingFilterParam } from '@/interfaces/_query-param.interfaces';
import { generateFilterQueryString } from '@/utils/generator/string-generator/generate-filter-query-string';
import { wireApi } from 'fetchwire';
import { ResponseWithMeta } from '@/interfaces/_meta.interfaces';

export async function createBookingApi(data: CreateBookingRequest) {
  return wireApi<BookingResponse>('/booking', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getBookingsByOrganizationIdApi(
  organizationId: string,
  filter?: BookingFilterParam
) {
  const filterQueryString = generateFilterQueryString(filter, {
    status: filter?.status,
  });
  return wireApi<ResponseWithMeta<BookingResponse, BookingMeta>[]>(
    `/booking/organization/${organizationId}${filterQueryString}`,
    { method: 'GET' }
  );
}

export async function getBookingsByOrganizationCustomerOrganizationIdApi(
  organizationId: string,
  filter?: BookingFilterParam
) {
  const filterQueryString = generateFilterQueryString(filter, {
    status: filter?.status,
  });
  return wireApi<ResponseWithMeta<BookingResponse, BookingMeta>[]>(
    `/booking/by-organization-customer/organization/${organizationId}${filterQueryString}`,
    { method: 'GET' }
  );
}

export async function getBookingByIdApi(id: string) {
  return wireApi<ResponseWithMeta<BookingResponse, BookingMeta>>(`/booking/${id}`, {
    method: 'GET',
  });
}

export async function updateBookingApi(id: string, data: UpdateBookingRequest) {
  return wireApi<BookingResponse>(`/booking/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteBookingApi(id: string) {
  return wireApi<void>(`/booking/${id}`, {
    method: 'DELETE',
  });
}

export async function getBookingsByTourImplementationIdApi(
  tourImplementationId: string,
  filter?: BookingFilterParam
) {
  const filterQueryString = generateFilterQueryString(filter, {
    status: filter?.status,
  });
  return wireApi<BookingResponse[]>(
    `/booking/tour-implementation/${tourImplementationId}${filterQueryString}`,
    { method: 'GET' }
  );
}
