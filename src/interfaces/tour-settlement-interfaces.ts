import { UserResponse } from './user-interfaces';
import { TourResponse } from './tour-interfaces';
import { ReceiptPaymentResponse } from './receipt-payment-interfaces';

export interface TourSettlementResponse {
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

export interface UpdateTourSettlementRequest {
  adultTicketCount?: number;
  childTicketCount?: number;
  adultTicketPrice?: number;
  childTicketPrice?: number;
  taxRate?: number;
}
