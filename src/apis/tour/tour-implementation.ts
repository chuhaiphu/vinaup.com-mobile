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
import { ResponseWithMeta } from '@/interfaces/_meta.interfaces';
import { wireApi } from 'fetchwire';

export async function getTourImplementationByTourIdApi(tourId: string) {
    return wireApi<ResponseWithMeta<TourImplementationResponse, TourImplementationMeta>>(
        `/tour-implementation/by-tour/${tourId}`,
        {
            method: 'GET',
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
