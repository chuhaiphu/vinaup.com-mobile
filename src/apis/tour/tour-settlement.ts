import {
    TourSettlementCancelLogResponse,
    TourSettlementMeta,
    TourSettlementResponse,
    UpdateTourSettlementRequest,
} from '@/interfaces/tour-settlement-interfaces';
import { ResponseWithMeta } from '@/interfaces/_meta.interfaces';
import { wireApi } from 'fetchwire';

export async function getTourSettlementByTourIdApi(tourId: string) {
    return wireApi<ResponseWithMeta<TourSettlementResponse, TourSettlementMeta>>(`/tour-settlement/by-tour/${tourId}`, {
        method: 'GET',
    });
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
