import { OrganizationResponse } from './organization-interfaces';
import { OrganizationCustomerResponse } from './organization-customer-interfaces';
import { UserResponse } from './user-interfaces';
import { ReceiptPaymentResponse } from './receipt-payment-interfaces';
import { BookingStatus } from '@/constants/booking-constants';
import { TourImplementationResponse } from './tour-implementation-interfaces';
import { BaseMeta } from './_meta.interfaces';

export interface BookingResponse {
  id: string;
  code: string | null;
  description: string;
  content: string | null;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string | null;
  createdBy: UserResponse | null;
  organizationId: string;
  organization: OrganizationResponse;
  organizationCustomerId: string | null;
  organizationCustomer: OrganizationCustomerResponse | null;
  receiptPayments: ReceiptPaymentResponse[];
  tourImplementationId: string | null;
  tourImplementation: TourImplementationResponse | null;
}

export interface CreateBookingRequest {
  code?: string;
  description: string;
  content?: string;
  startDate: string;
  endDate: string;
  note?: string;
  organizationId: string;
  organizationCustomerId?: string;
  tourImplementationId?: string;
}

export type UpdateBookingRequest = Partial<CreateBookingRequest> & {
  code?: string;
  tourImplementationId?: string | null;
};

export interface BookingMeta extends BaseMeta {
  isSender: boolean;
  isSenderSigned?: boolean;
  isReceiverSigned?: boolean;
}