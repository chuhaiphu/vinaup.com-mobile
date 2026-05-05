import {
    CreateTourRequest,
    TourResponse,
    UpdateTourRequest,
} from '@/interfaces/tour-interfaces';
import { TourFilterParam } from '@/interfaces/_query-param.interfaces';
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
