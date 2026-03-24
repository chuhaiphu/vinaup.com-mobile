import { UserResponse } from './user-interfaces';
import { TourResponse } from './tour-interfaces';
import { ReceiptPaymentResponse } from './receipt-payment-interfaces';
import { SignatureResponse } from './signature-interfaces';

export interface TourCalculationResponse {
  id: string;
  adultTicketCount: number;
  childTicketCount: number;
  adultTicketPrice: number;
  childTicketPrice: number;
  taxRate: number;
  createdBy: UserResponse;
  tour: TourResponse;
  receiptPayments: ReceiptPaymentResponse[];
}

export interface UpdateTourCalculationRequest {
  adultTicketCount?: number;
  childTicketCount?: number;
  adultTicketPrice?: number;
  childTicketPrice?: number;
  taxRate?: number;
}

export interface TourCalculationCancelLogSnapshotData {
  tourCalculation: Record<string, unknown>;
  signatures: SignatureResponse[];
}

export interface TourCalculationCancelLogResponse {
  id: string;
  tourCalculationId: string;
  canceledByUserId: string;
  canceledByUser: UserResponse;
  snapshotData: TourCalculationCancelLogSnapshotData | Record<string, unknown>;
  createdAt: string;
}
