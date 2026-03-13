import { CreateTourRequest, TourResponse, UpdateTourRequest } from "@/interfaces/tour-interfaces";
import { TourCalculationResponse, UpdateTourCalculationRequest } from "@/interfaces/tour-calculation-interfaces";
import { TourSettlementResponse, UpdateTourSettlementRequest } from "@/interfaces/tour-settlement-interfaces";
import { TourFilterParam } from "@/interfaces/_query-param.interfaces";
import {
  TourImplementationResponse,
  UpdateTourImplementationRequest,
  CreateMemberInChargeRequest,
  CreateUserInvitedRequest,
  UpdateUserInvitedRequest,
  MemberInChargeTourImplementationResponse,
  UserInvitedTourImplementationResponse,
  TourImplementationAdditionalDataResponse,
  CreateTourImplementationAdditionalDataRequest,
  UpdateTourImplementationAdditionalDataRequest,
} from "@/interfaces/tour-implementation-interfaces";
import { api } from "./_base";
import { buildFilterQueryString } from "@/utils/api-helpers";

export async function createTourApi(data: CreateTourRequest) {
  return api<TourResponse>("/tour", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getToursByOrganizationIdApi(
  organizationId: string,
  filter?: TourFilterParam
) {
  const filterQueryString = buildFilterQueryString(filter, { status: filter?.status });
  return api<TourResponse[]>(
    `/tour/organization/${organizationId}${filterQueryString}`,
    {
      method: "GET",
    }
  );
}

export async function getTourByIdApi(id: string) {
  return api<TourResponse>(`/tour/${id}`, {
    method: "GET",
  });
}

export async function updateTourApi(id: string, data: UpdateTourRequest) {
  return api<TourResponse>(`/tour/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTourApi(id: string) {
  return api<null>(`/tour/${id}`, {
    method: "DELETE",
  });
}

export async function getTourCalculationByTourIdApi(tourId: string) {
  return api<TourCalculationResponse>(`/tour/tour-calculation/${tourId}`, {
    method: "GET",
  });
}

export async function getTourImplementationByTourIdApi(tourId: string) {
  return api<TourImplementationResponse>(`/tour/tour-implementation/${tourId}`, {
    method: "GET",
  });
}

export async function getTourSettlementByTourIdApi(tourId: string) {
  return api<TourSettlementResponse>(`/tour/tour-settlement/${tourId}`, {
    method: "GET",
  });
}

export async function updateTourCalculationApi(
  tourCalculationId: string,
  data: UpdateTourCalculationRequest
) {
  return api<TourCalculationResponse>(`/tour/tour-calculation/${tourCalculationId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateTourImplementationApi(
  tourImplementationId: string,
  data: UpdateTourImplementationRequest
) {
  return api<TourImplementationResponse>(`/tour/tour-implementation/${tourImplementationId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateTourSettlementApi(
  tourSettlementId: string,
  data: UpdateTourSettlementRequest
) {
  return api<TourSettlementResponse>(`/tour/tour-settlement/${tourSettlementId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// User In Charge APIs
export async function getMembersInChargeByTourImplementationIdApi(
  tourImplementationId: string
) {
  return api<MemberInChargeTourImplementationResponse[]>(
    `/tour/tour-implementation/${tourImplementationId}/members-in-charge`,
    {
      method: "GET",
    }
  );
}

export async function addMemberInChargeApi(
  tourImplementationId: string,
  data: CreateMemberInChargeRequest
) {
  return api<MemberInChargeTourImplementationResponse>(
    `/tour/tour-implementation/${tourImplementationId}/members-in-charge`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function removeMemberInChargeApi(
  memberInChargeId: string
) {
  return api<null>(
    `/tour/tour-implementation/members-in-charge/${memberInChargeId}`,
    {
      method: "DELETE",
    }
  );
}

// User Invited APIs
export async function addUserInvitedApi(
  data: CreateUserInvitedRequest
) {
  return api<UserInvitedTourImplementationResponse>(
    `/tour/tour-implementation/users-invited`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateUserInvitedApi(
  userInvitedId: string,
  data: UpdateUserInvitedRequest
) {
  return api<UserInvitedTourImplementationResponse>(
    `/tour/tour-implementation/users-invited/${userInvitedId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

// Additional Data APIs
export async function getAdditionalDataByTourImplementationIdApi(
  tourImplementationId: string
) {
  return api<TourImplementationAdditionalDataResponse[]>(
    `/tour/tour-implementation/${tourImplementationId}/additional-data`,
    {
      method: "GET",
    }
  );
}

export async function createAdditionalDataApi(
  tourImplementationId: string,
  data: CreateTourImplementationAdditionalDataRequest
) {
  return api<TourImplementationAdditionalDataResponse>(
    `/tour/tour-implementation/${tourImplementationId}/additional-data`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateAdditionalDataApi(
  additionalDataId: string,
  data: UpdateTourImplementationAdditionalDataRequest
) {
  return api<TourImplementationAdditionalDataResponse>(
    `/tour/tour-implementation/additional-data/${additionalDataId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteAdditionalDataApi(
  additionalDataId: string
) {
  return api<null>(
    `/tour/tour-implementation/additional-data/${additionalDataId}`,
    {
      method: "DELETE",
    }
  );
}

export async function removeUserInvitedApi(
  userInvitedId: string
) {
  return api<null>(
    `/tour/tour-implementation/users-invited/${userInvitedId}`,
    {
      method: "DELETE",
    }
  );
}

export async function importReceiptPaymentFromTourCalculationToTourImplementationApi(
  tourId: string
) {
  return api<null>(
    `/tour/${tourId}/import-receipt-payment-from-tour-calculation-to-tour-implementation`,
    {
      method: "POST",
    }
  );
}

