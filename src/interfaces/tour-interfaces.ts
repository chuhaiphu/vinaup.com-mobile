import { OrganizationResponse } from './organization-interfaces';
import { UserResponse } from './user-interfaces';
import { OrganizationCustomerResponse } from './organization-customer-interfaces';
import { TourStatus } from '@/constants/tour-constants';
import { TourCalculationResponse } from './tour-calculation-interfaces';
import { TourImplementationResponse } from './tour-implementation-interfaces';
import { TourSettlementResponse } from './tour-settlement-interfaces';

export interface TourResponse {
  id: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TourStatus;
  note: string | null;
  createdAt: string;
  createdByUserId: string | null;
  createdBy: UserResponse | null;
  organizationId: string;
  organization: OrganizationResponse | null;
  organizationCustomerId: string | null;
  organizationCustomer: OrganizationCustomerResponse | null;
  externalOrganizationName: string | null;
  externalCustomerName: string | null;
  tourCalculation: TourCalculationResponse | null;
  tourImplementation: TourImplementationResponse | null;
  tourSettlement: TourSettlementResponse | null;
}

export interface CreateTourRequest {
  description: string;
  startDate: string;
  endDate: string;
  note?: string;
  organizationId: string;
  organizationCustomerId?: string;
  externalOrganizationName?: string;
  externalCustomerName?: string;
}

export type UpdateTourRequest = Partial<CreateTourRequest> & {
  status?: TourStatus;
  adultTicketCount?: number;
  childTicketCount?: number;
  adultTicketPrice?: number;
  childTicketPrice?: number;
};
