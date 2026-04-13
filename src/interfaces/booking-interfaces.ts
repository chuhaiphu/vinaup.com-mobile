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
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserResponse | null;
  organization: OrganizationResponse;
  organizationCustomer: OrganizationCustomerResponse | null;
  fromOrganizationId: string | null;
  fromOrganization: OrganizationResponse | null;
  sourceBookingId: string | null;
  sourceBooking: BookingResponse | null;
  targetBooking: BookingResponse | null;
  receiptPayments: ReceiptPaymentResponse[];
  tourImplementation: TourImplementationResponse | null;
}

export interface CreateBookingRequest {
  description: string;
  content?: string;
  startDate: Date;
  endDate: Date;
  note?: string;
  organizationId: string;
  organizationCustomerId?: string;
  fromOrganizationId?: string;
  sourceBookingId?: string;
  tourImplementationId?: string;
}

export type UpdateBookingRequest = Partial<CreateBookingRequest> & {
  status?: BookingStatus;
  tourImplementationId?: string | null;
};
