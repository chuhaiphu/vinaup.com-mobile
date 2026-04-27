export interface DateFilterParam {
  startDate?: string;
  endDate?: string;
}

export interface ProjectFilterParam extends DateFilterParam {
  type?: string;
  status?: string;
}

export interface InvoiceFilterParam extends DateFilterParam {
  invoiceTypeId?: string;
  status?: string;
}

export interface TourFilterParam extends DateFilterParam {
  status?: string;
}

export interface ReceiptPaymentFilterParam extends DateFilterParam {
  type?: 'RECEIPT' | 'PAYMENT';
}

export interface BookingFilterParam extends DateFilterParam {
  status?: string;
  tourImplementationId?: string;
}

export interface CarFilterParam extends DateFilterParam {
  name?: string;
  plateNumber?: string;
}