import {
    TourCalculationCancelLogResponse,
    TourCalculationMeta,
    TourCalculationResponse,
    UpdateTourCalculationRequest,
} from '@/interfaces/tour-calculation-interfaces';
import { ResponseWithMeta } from '@/interfaces/_meta.interfaces';
import { wireApi } from 'fetchwire';

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
