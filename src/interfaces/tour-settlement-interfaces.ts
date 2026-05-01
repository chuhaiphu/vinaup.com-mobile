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
  createdByUserId: string | null;
  createdBy: UserResponse | null;
  tourId: string;
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
  };
  signatures: SignatureResponse[];
}

export interface TourSettlementCancelLogResponse {
  id: string;
  tourSettlementId: string;
  canceledByUserId: string | null;
  canceledByUser: UserResponse | null;
  snapshotData: TourSettlementCancelLogSnapshotData;
  createdAt: string;
}
