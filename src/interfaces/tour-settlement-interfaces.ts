import { UserResponse } from './user-interfaces';
import { TourResponse } from './tour-interfaces';
import { ReceiptPaymentResponse } from './receipt-payment-interfaces';
import { SignatureResponse } from './signature-interfaces';

export interface TourSettlementResponse {
  id: string;
  adultTicketCount: number;
  childTicketCount: number;
  adultTicketPrice: number;
  childTicketPrice: number;
  taxRate: number;
  createdBy: UserResponse | null;
  tour: TourResponse;
  receiptPayments: ReceiptPaymentResponse[];
}

export interface UpdateTourSettlementRequest {
  adultTicketCount?: number;
  childTicketCount?: number;
  adultTicketPrice?: number;
  childTicketPrice?: number;
  taxRate?: number;
}

export interface TourSettlementCancelLogSnapshotData {
  tourSettlement: {
    id?: string;
    adultTicketCount?: number;
    childTicketCount?: number;
    adultTicketPrice?: number;
    childTicketPrice?: number;
    taxRate?: number;
    createdByUserId?: string;
    tourId?: string;
    createdBy?: UserResponse;
    tour?: TourResponse;
    receiptPayments?: ReceiptPaymentResponse[];
    [key: string]: unknown;
  };
  signatures: SignatureResponse[];
}

export interface TourSettlementCancelLogResponse {
  id: string;
  tourSettlementId: string;
  canceledByUserId: string | null;
  canceledByUser: UserResponse | null;
  snapshotData: TourSettlementCancelLogSnapshotData | Record<string, unknown>;
  createdAt: string;
}
