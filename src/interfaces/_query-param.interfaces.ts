export interface DateFilterParam {
  date?: Date;
  month?: number;
  quarter?: number;
  year?: number;
}

export interface ProjectFilterParam extends DateFilterParam {
  type?: 'SELF' | 'COMPANY' | 'ORGANIZATION';
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