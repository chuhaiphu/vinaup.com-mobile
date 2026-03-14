import {
  CreateBookingRequest,
  BookingResponse,
  UpdateBookingRequest,
} from '@/interfaces/booking-interfaces';
import { BookingFilterParam } from '@/interfaces/_query-param.interfaces';
import { buildFilterQueryString } from '@/utils/api-helpers';
import { wireApi } from 'fetchwire';

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
  const filterQueryString = buildFilterQueryString(filter, {
    status: filter?.status,
  });
  return wireApi<BookingResponse[]>(
    `/booking/organization/${organizationId}${filterQueryString}`,
    { method: 'GET' }
  );
}

export async function getBookingByIdApi(id: string) {
  return wireApi<BookingResponse>(`/booking/${id}`, {
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
  return wireApi<null>(`/booking/${id}`, {
    method: 'DELETE',
  });
}

export async function getBookingsByTourImplementationIdApi(
  tourImplementationId: string,
  filter?: BookingFilterParam
) {
  const filterQueryString = buildFilterQueryString(filter, {
    status: filter?.status,
  });
  return wireApi<BookingResponse[]>(
    `/booking/tour-implementation/${tourImplementationId}${filterQueryString}`,
    { method: 'GET' }
  );
}
