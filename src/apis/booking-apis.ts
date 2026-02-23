import { CreateBookingRequest, BookingResponse, UpdateBookingRequest } from "@/interfaces/booking-interfaces";
import { BookingFilterParam } from "@/interfaces/_query-param.interfaces";
import { buildFilterQueryString } from "@/utils/helpers";
import { api } from "./_base";

export async function createBookingApi(data: CreateBookingRequest) {
  return api<BookingResponse>("/booking", {
    method: "POST",
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
  return api<BookingResponse[]>(
    `/booking/organization/${organizationId}${filterQueryString}`,
    { method: "GET" }
  );
}

export async function getBookingByIdApi(id: string) {
  return api<BookingResponse>(`/booking/${id}`, {
    method: "GET",
  });
}

export async function updateBookingApi(id: string, data: UpdateBookingRequest) {
  return api<BookingResponse>(`/booking/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBookingApi(id: string) {
  return api<null>(`/booking/${id}`, {
    method: "DELETE",
  });
}

export async function getBookingsByTourImplementationIdApi(
  tourImplementationId: string,
  filter?: BookingFilterParam
) {
  const filterQueryString = buildFilterQueryString(filter, {
    status: filter?.status,
  });
  return api<BookingResponse[]>(
    `/booking/tour-implementation/${tourImplementationId}${filterQueryString}`,
    { method: "GET" }
  );
}
