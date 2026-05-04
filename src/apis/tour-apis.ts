import {
  CreateTourRequest,
  TourResponse,
  UpdateTourRequest,
} from '@/interfaces/tour-interfaces';
import {
  TourCalculationCancelLogResponse,
  TourCalculationMeta,
  TourCalculationResponse,
  UpdateTourCalculationRequest,
} from '@/interfaces/tour-calculation-interfaces';
import {
  TourSettlementCancelLogResponse,
  TourSettlementMeta,
  TourSettlementResponse,
  UpdateTourSettlementRequest,
} from '@/interfaces/tour-settlement-interfaces';
import { ResponseWithMeta } from '@/interfaces/_meta.interfaces';
import { TourFilterParam } from '@/interfaces/_query-param.interfaces';
import {
  TourImplementationMeta,
  TourImplementationResponse,
  UpdateTourImplementationRequest,
  ManageMembersInChargeRequest,
  CreateUserInvitedRequest,
  UpdateUserInvitedRequest,
  MemberInChargeTourImplementationResponse,
  UserInvitedTourImplementationResponse,
  TourImplementationAdditionalDataResponse,
  UpdateTourImplementationAdditionalDataRequest,
} from '@/interfaces/tour-implementation-interfaces';
import { wireApi } from 'fetchwire';
import { generateFilterQueryString } from '@/utils/generator/string-generator/generate-filter-query-string';

export async function createTourApi(data: CreateTourRequest) {
  return wireApi<TourResponse>('/tour', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getToursByOrganizationIdApi(
  organizationId: string,
  filter?: TourFilterParam
) {
  const filterQueryString = generateFilterQueryString(filter, {
    status: filter?.status,
  });
  return wireApi<TourResponse[]>(
    `/tour/organization/${organizationId}${filterQueryString}`,
    {
      method: 'GET',
    }
  );
}

export async function getTourByIdApi(id: string) {
  return wireApi<TourResponse>(`/tour/${id}`, {
    method: 'GET',
  });
}

export async function updateTourApi(id: string, data: UpdateTourRequest) {
  return wireApi<TourResponse>(`/tour/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteTourApi(id: string) {
  return wireApi<void>(`/tour/${id}`, {
    method: 'DELETE',
  });
}

export async function getTourCalculationByTourIdApi(tourId: string) {
  return wireApi<ResponseWithMeta<TourCalculationResponse, TourCalculationMeta>>(`/tour-calculation/by-tour/${tourId}`, {
    method: 'GET',
  });
}

export async function getTourCalculationLogsByTourCalculationIdApi(
  tourCalculationId: string
) {
  return wireApi<TourCalculationCancelLogResponse[]>(
    `/tour-calculation/${tourCalculationId}/cancel-logs`,
    {
      method: 'GET',
    }
  );
}

export async function getTourCalculationCancelLogByIdApi(id: string) {
  return wireApi<TourCalculationCancelLogResponse>(
    `/tour-calculation/cancel-logs/${id}`,
    {
      method: 'GET',
    }
  );
}

export async function getTourImplementationByTourIdApi(tourId: string) {
  return wireApi<ResponseWithMeta<TourImplementationResponse, TourImplementationMeta>>(
    `/tour-implementation/by-tour/${tourId}`,
    {
      method: 'GET',
    }
  );
}

export async function getTourSettlementByTourIdApi(tourId: string) {
  return wireApi<ResponseWithMeta<TourSettlementResponse, TourSettlementMeta>>(`/tour-settlement/by-tour/${tourId}`, {
    method: 'GET',
  });
}

export async function updateTourCalculationApi(
  tourCalculationId: string,
  data: UpdateTourCalculationRequest
) {
  return wireApi<TourCalculationResponse>(
    `/tour-calculation/${tourCalculationId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

export async function updateTourImplementationApi(
  tourImplementationId: string,
  data: UpdateTourImplementationRequest
) {
  return wireApi<TourImplementationResponse>(
    `/tour-implementation/${tourImplementationId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

export async function updateTourSettlementApi(
  tourSettlementId: string,
  data: UpdateTourSettlementRequest
) {
  return wireApi<TourSettlementResponse>(
    `/tour-settlement/${tourSettlementId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

export async function getTourSettlementLogsByTourSettlementIdApi(
  tourSettlementId: string
) {
  return wireApi<TourSettlementCancelLogResponse[]>(
    `/tour-settlement/${tourSettlementId}/cancel-logs`,
    {
      method: 'GET',
    }
  );
}

export async function getTourSettlementCancelLogByIdApi(id: string) {
  return wireApi<TourSettlementCancelLogResponse>(
    `/tour-settlement/cancel-logs/${id}`,
    {
      method: 'GET',
    }
  );
}

// User In Charge APIs
export async function getMembersInChargeByTourImplementationIdApi(
  tourImplementationId: string
) {
  return wireApi<ResponseWithMeta<MemberInChargeTourImplementationResponse, TourImplementationMeta>[]>(
    `/tour-implementation/${tourImplementationId}/members-in-charge`,
    {
      method: 'GET',
    }
  );
}

export async function manageMembersInChargeApi(
  tourImplementationId: string,
  data: ManageMembersInChargeRequest
) {
  return wireApi<MemberInChargeTourImplementationResponse[]>(
    `/tour-implementation/${tourImplementationId}/members-in-charge`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

// User Invited APIs
export async function addUserInvitedApi(data: CreateUserInvitedRequest) {
  return wireApi<UserInvitedTourImplementationResponse>(
    `/tour-implementation/users-invited`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

export async function updateUserInvitedApi(
  userInvitedId: string,
  data: UpdateUserInvitedRequest
) {
  return wireApi<UserInvitedTourImplementationResponse>(
    `/tour-implementation/users-invited/${userInvitedId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

// Additional Data APIs
export async function getAdditionalDataByTourImplementationIdApi(
  tourImplementationId: string
) {
  return wireApi<ResponseWithMeta<TourImplementationAdditionalDataResponse, TourImplementationMeta>[]>(
    `/tour-implementation/${tourImplementationId}/additional-data`,
    {
      method: 'GET',
    }
  );
}

export async function createAdditionalDataApi(tourImplementationId: string) {
  return wireApi<TourImplementationAdditionalDataResponse>(
    `/tour-implementation/${tourImplementationId}/additional-data`,
    { method: 'POST' }
  );
}

export async function updateAdditionalDataApi(
  additionalDataId: string,
  data: UpdateTourImplementationAdditionalDataRequest
) {
  return wireApi<TourImplementationAdditionalDataResponse>(
    `/tour-implementation/additional-data/${additionalDataId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

export async function deleteAdditionalDataApi(additionalDataId: string) {
  return wireApi<void>(
    `/tour-implementation/additional-data/${additionalDataId}`,
    {
      method: 'DELETE',
    }
  );
}

export async function removeUserInvitedApi(userInvitedId: string) {
  return wireApi<void>(`/tour-implementation/users-invited/${userInvitedId}`, {
    method: 'DELETE',
  });
}

export async function importReceiptPaymentFromTourCalculationToTourImplementationApi(
  tourId: string
) {
  return wireApi<null>(
    `/tour/${tourId}/import-receipt-payments`,
    {
      method: 'POST',
    }
  );
}
