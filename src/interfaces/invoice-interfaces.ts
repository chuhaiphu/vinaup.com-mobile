import { OrganizationResponse } from './organization-interfaces';
import { UserResponse } from './user-interfaces';
import { OrganizationCustomerResponse } from './organization-customer-interfaces';
import { InvoiceTypeResponse } from './invoice-type-interfaces';
import { InvoiceDiscountType, InvoiceStatus } from '@/constants/invoice-constants';

export interface InvoiceResponse {
  id: string;
  invoiceType: InvoiceTypeResponse;
  code: string;
  description: string;
  startDate: Date;
  endDate: Date;
  discountAmount: number;
  vatRate: number;
  discountRate: number;
  discountType: InvoiceDiscountType;
  surchargeAmount: number;
  status: InvoiceStatus;
  note: string | null;
  createdAt: Date;
  createdBy: UserResponse;
  externalOrganizationName: string | null;
  externalCustomerName: string | null;
  organization: OrganizationResponse | null;
  organizationCustomer: OrganizationCustomerResponse | null;
}

export interface CreateInvoiceRequest {
  invoiceTypeId: string;
  description: string;
  endDate: Date;
  startDate?: Date;
  note?: string;
  organizationId?: string;
  organizationCustomerId?: string | null;
  externalOrganizationName?: string;
  externalCustomerName?: string | null;
}

export type UpdateInvoiceRequest = Partial<CreateInvoiceRequest> & {
  status?: InvoiceStatus;
  discountAmount?: number;
  discountRate?: number;
  vatRate?: number;
  discountType?: InvoiceDiscountType;
  surchargeAmount?: number;
};
