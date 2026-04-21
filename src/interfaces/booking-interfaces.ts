import { OrganizationResponse } from './organization-interfaces';
import { OrganizationCustomerResponse } from './organization-customer-interfaces';
import { UserResponse } from './user-interfaces';
import { ReceiptPaymentResponse } from './receipt-payment-interfaces';
import { BookingStatus } from '@/constants/booking-constants';
import { TourImplementationResponse } from './tour-implementation-interfaces';

export interface BookingResponse {
  id: string;
  code: string;
  description: string;
  content: string | null;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: UserResponse | null;
  organization: OrganizationResponse;
  organizationCustomer: OrganizationCustomerResponse | null;
  receiptPayments: ReceiptPaymentResponse[];
  tourImplementation: TourImplementationResponse | null;
}

export interface CreateBookingRequest {
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
  status?: BookingStatus;
  tourImplementationId?: string | null;
};
