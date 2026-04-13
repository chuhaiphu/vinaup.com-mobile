import { CategoryResponse } from './category-interfaces';
import { ProjectResponse } from './project-interfaces';
import { UserResponse } from './user-interfaces';
import { InvoiceResponse } from './invoice-interfaces';
import { TourCalculationResponse } from './tour-calculation-interfaces';
import { TourSettlementResponse } from './tour-settlement-interfaces';
import { BookingResponse } from './booking-interfaces';
import {
  ReceiptPaymentTransactionType,
  ReceiptPaymentType,
} from '@/constants/receipt-payment-constants';

export interface ReceiptPaymentResponse {
  id: string;
  type: ReceiptPaymentType;
  description: string | null;
  unitPrice: number;
  currency: string;
  transactionType: ReceiptPaymentTransactionType;
  transactionDate: string;
  quantity: number;
  frequency: number;
  vatRate: number;
  note: string | null;
  createdBy: UserResponse | null;
  category: CategoryResponse;
  project: ProjectResponse | null;
  invoice: InvoiceResponse | null;
  booking: BookingResponse | null;
  tourCalculation: TourCalculationResponse | null;
  tourImplementationReceiptPayments: {
    id: string;
    tourImplementationId: string;
    receiptPaymentId: string;
    groupCode: string;
  }[];
  tourSettlement: TourSettlementResponse | null;
}

export interface CreateReceiptPaymentRequest {
  type: ReceiptPaymentType;
  description: string;
  unitPrice: number;
  currency: string;
  transactionType: ReceiptPaymentTransactionType;
  transactionDate: string;
  quantity: number;
  frequency: number;
  vatRate?: number;
  note?: string | null;
  categoryId: string;
  invoiceId?: string;
  projectId?: string;
  bookingId?: string;
  organizationId?: string;
  tourCalculationId?: string;
  tourImplementationId?: string;
  tourSettlementId?: string;
  groupCode?: string;
}

export type UpdateReceiptPaymentRequest = Partial<CreateReceiptPaymentRequest>;
