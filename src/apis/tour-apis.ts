import {
  CreateTourRequest,
  TourResponse,
  UpdateTourRequest,
} from '@/interfaces/tour-interfaces';
import {
  TourCalculationCancelLogResponse,
  TourCalculationResponse,
  UpdateTourCalculationRequest,
} from '@/interfaces/tour-calculation-interfaces';
import {
  TourSettlementResponse,
  UpdateTourSettlementRequest,
} from '@/interfaces/tour-settlement-interfaces';
import { TourFilterParam } from '@/interfaces/_query-param.interfaces';
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
} from '@/interfaces/tour-implementation-interfaces';
import { wireApi } from 'fetchwire';
import { buildFilterQueryString } from '@/utils/api-helpers';

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
  const filterQueryString = buildFilterQueryString(filter, {
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
  return wireApi<null>(`/tour/${id}`, {
    method: 'DELETE',
  });
}

export async function getTourCalculationByTourIdApi(tourId: string) {
  return wireApi<TourCalculationResponse>(`/tour/tour-calculation/${tourId}`, {
    method: 'GET',
  });
}

export async function getTourCalculationLogsByTourCalculationIdApi(
  tourCalculationId: string
) {
  return wireApi<TourCalculationCancelLogResponse[]>(
    `/tour/tour-calculation/${tourCalculationId}/logs`,
    {
      method: 'GET',
    }
  );
}

export async function getTourImplementationByTourIdApi(tourId: string) {
  return wireApi<TourImplementationResponse>(
    `/tour/tour-implementation/${tourId}`,
    {
      method: 'GET',
    }
  );
}

export async function getTourSettlementByTourIdApi(tourId: string) {
  return wireApi<TourSettlementResponse>(`/tour/tour-settlement/${tourId}`, {
    method: 'GET',
  });
}

export async function updateTourCalculationApi(
  tourCalculationId: string,
  data: UpdateTourCalculationRequest
) {
  return wireApi<TourCalculationResponse>(
    `/tour/tour-calculation/${tourCalculationId}`,
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
    `/tour/tour-implementation/${tourImplementationId}`,
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
    `/tour/tour-settlement/${tourSettlementId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

// User In Charge APIs
export async function getMembersInChargeByTourImplementationIdApi(
  tourImplementationId: string
) {
  return wireApi<MemberInChargeTourImplementationResponse[]>(
    `/tour/tour-implementation/${tourImplementationId}/members-in-charge`,
    {
      method: 'GET',
    }
  );
}

export async function addMemberInChargeApi(
  tourImplementationId: string,
  data: CreateMemberInChargeRequest
) {
  return wireApi<MemberInChargeTourImplementationResponse>(
    `/tour/tour-implementation/${tourImplementationId}/members-in-charge`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

export async function removeMemberInChargeApi(memberInChargeId: string) {
  return wireApi<null>(
    `/tour/tour-implementation/members-in-charge/${memberInChargeId}`,
    {
      method: 'DELETE',
    }
  );
}

// User Invited APIs
export async function addUserInvitedApi(data: CreateUserInvitedRequest) {
  return wireApi<UserInvitedTourImplementationResponse>(
    `/tour/tour-implementation/users-invited`,
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
    `/tour/tour-implementation/users-invited/${userInvitedId}`,
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
  return wireApi<TourImplementationAdditionalDataResponse[]>(
    `/tour/tour-implementation/${tourImplementationId}/additional-data`,
    {
      method: 'GET',
    }
  );
}

export async function createAdditionalDataApi(
  tourImplementationId: string,
  data: CreateTourImplementationAdditionalDataRequest
) {
  return wireApi<TourImplementationAdditionalDataResponse>(
    `/tour/tour-implementation/${tourImplementationId}/additional-data`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

export async function updateAdditionalDataApi(
  additionalDataId: string,
  data: UpdateTourImplementationAdditionalDataRequest
) {
  return wireApi<TourImplementationAdditionalDataResponse>(
    `/tour/tour-implementation/additional-data/${additionalDataId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

export async function deleteAdditionalDataApi(additionalDataId: string) {
  return wireApi<null>(
    `/tour/tour-implementation/additional-data/${additionalDataId}`,
    {
      method: 'DELETE',
    }
  );
}

export async function removeUserInvitedApi(userInvitedId: string) {
  return wireApi<null>(`/tour/tour-implementation/users-invited/${userInvitedId}`, {
    method: 'DELETE',
  });
}

export async function importReceiptPaymentFromTourCalculationToTourImplementationApi(
  tourId: string
) {
  return wireApi<null>(
    `/tour/${tourId}/import-receipt-payment-from-tour-calculation-to-tour-implementation`,
    {
      method: 'POST',
    }
  );
}
