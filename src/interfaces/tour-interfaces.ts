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
  startDate: Date;
  endDate: Date;
  status: TourStatus;
  note: string | null;
  createdAt: Date;
  createdBy: UserResponse | null;
  externalOrganizationName: string | null;
  externalCustomerName: string | null;
  organization: OrganizationResponse | null;
  organizationCustomer: OrganizationCustomerResponse | null;
  tourCalculation: TourCalculationResponse | null;
  tourImplementation: TourImplementationResponse | null;
  tourSettlement: TourSettlementResponse | null;
}

export interface CreateTourRequest {
  description: string;
  startDate: Date;
  endDate: Date;
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
