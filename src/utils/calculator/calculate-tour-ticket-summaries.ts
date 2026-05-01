import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';

/**
 * Tính tóm tắt tài chính tour: doanh thu vé + thu/chi → lợi nhuận và biên lợi nhuận.
 *
 * @param receiptPayments - Toàn bộ danh sách thu/chi của tour.
 * @param tourTicket - Cấu hình vé (số lượng, đơn giá, thuế). Truyền null để coi tất cả bằng 0.
 * @returns { totalReceipt, totalPayment, totalTaxPay, netProfitBeforeTaxPay,
 *   netProfitAfterTaxPay, profitMarginBeforeTaxPay, profitMarginAfterTaxPay }
 */
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
