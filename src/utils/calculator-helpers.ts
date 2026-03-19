import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';

export function calculateReceiptPaymentsSummary(
  receiptPayments?: ReceiptPaymentResponse[] | null
) {
  if (!receiptPayments || receiptPayments?.length === 0) {
    return {
      bankIn: 0,
      bankOut: 0,
      cashIn: 0,
      cashOut: 0,
      totalReceipt: 0,
      totalPayment: 0,
      totalRemaining: 0,
    };
  }

  return receiptPayments.reduce(
    (acc, item) => {
      const total = item.unitPrice * item.quantity * item.frequency;

      if (item.transactionType === 'BANK') {
        if (item.type === 'RECEIPT') acc.bankIn += total;
        else acc.bankOut += total;
      } else if (item.transactionType === 'CASH') {
        if (item.type === 'RECEIPT') acc.cashIn += total;
        else acc.cashOut += total;
      }

      if (item.type === 'PAYMENT') acc.totalPayment += total;
      else if (item.type === 'RECEIPT') acc.totalReceipt += total;

      acc.totalRemaining = acc.totalReceipt - acc.totalPayment;
      return acc;
    },
    {
      bankIn: 0,
      bankOut: 0,
      cashIn: 0,
      cashOut: 0,
      totalReceipt: 0,
      totalPayment: 0,
      totalRemaining: 0,
    }
  );
}

export function calculateTourTicketSummaries(
  receiptPayments: ReceiptPaymentResponse[],
  tourTicket: {
    adultTicketCount: number;
    childTicketCount: number;
    adultTicketPrice: number;
    childTicketPrice: number;
    taxRate: number;
  } | null
) {
  const adultTicketCount = tourTicket?.adultTicketCount || 0;
  const childTicketCount = tourTicket?.childTicketCount || 0;
  const adultTicketPrice = tourTicket?.adultTicketPrice || 0;
  const childTicketPrice = tourTicket?.childTicketPrice || 0;

  const ticketRevenue =
    adultTicketCount * adultTicketPrice + childTicketCount * childTicketPrice;

  const initialReceiptPaymentsSummary = {
    totalReceiptFromReceiptPayments: 0,
    totalPayment: 0,
    totalTaxDeducted: 0,
  };

  const receiptPaymentsSummary = (receiptPayments || []).reduce((acc, item) => {
    const total = item.unitPrice * item.quantity;
    const vatRate = item.vatRate || 0;

    if (item.type === 'RECEIPT') {
      acc.totalReceiptFromReceiptPayments += total;
    } else if (item.type === 'PAYMENT') {
      acc.totalPayment += total;
      if (vatRate > 0) {
        acc.totalTaxDeducted += Math.floor(total - total / (1 + vatRate / 100));
      }
    }

    return acc;
  }, initialReceiptPaymentsSummary);

  const totalReceipt =
    receiptPaymentsSummary.totalReceiptFromReceiptPayments + ticketRevenue;

  const totalPayment = receiptPaymentsSummary.totalPayment;
  const totalTaxPay = Math.floor(
    ticketRevenue -
      ticketRevenue / (1 + (tourTicket?.taxRate || 0) / 100) -
      receiptPaymentsSummary.totalTaxDeducted
  );

  const netProfitBeforeTaxPay = totalReceipt - totalPayment;
  const netProfitAfterTaxPay = netProfitBeforeTaxPay - totalTaxPay;

  const profitMarginBeforeTaxPay =
    totalReceipt > 0 ? (netProfitBeforeTaxPay / totalReceipt) * 100 : 0;

  const profitMarginAfterTaxPay =
    totalReceipt > 0 ? (netProfitAfterTaxPay / totalReceipt) * 100 : 0;

  return {
    totalReceipt,
    totalPayment,
    totalTaxPay,
    netProfitBeforeTaxPay,
    netProfitAfterTaxPay,
    profitMarginBeforeTaxPay,
    profitMarginAfterTaxPay,
  };
}
