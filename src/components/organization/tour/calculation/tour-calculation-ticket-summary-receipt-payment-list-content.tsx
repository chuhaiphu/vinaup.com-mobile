import { getReceiptPaymentsByTourCalculationIdApi } from '@/apis/receipt-payment-apis';
import { getTourCalculationByTourIdApi } from '@/apis/tour-apis';
import { ReceiptPaymentTourCalculationListContent } from '@/components/organization/tour/calculation/receipt-payment-tour-calculation-list-content';
import { TourCalculationTicketSummary } from '@/components/organization/tour/calculation/tour-calculation-ticket-summary';
import { calculateTourTicketSummaries } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { useFetch } from 'fetchwire';
import { useImperativeHandle } from 'react';

interface TourCalculationTicketSummaryReceiptPaymentListContentProps {
  tourId: string;
  startDate?: string;
  endDate?: string;
  organizationId?: string;
  ref?: React.Ref<{
    refreshData: {
      refreshTourCalculation: () => void;
      refreshReceiptPaymentsByTourCalculation: () => void;
    };
  }>;
}

export function TourCalculationTicketSummaryReceiptPaymentListContent({
  tourId,
  startDate,
  endDate,
  organizationId,
  ref,
}: TourCalculationTicketSummaryReceiptPaymentListContentProps) {
  const fetchTourCalculationFn = () => getTourCalculationByTourIdApi(tourId);
  const { data: tourCalculation, refreshFetch: refreshTourCalculation } = useFetch(
    fetchTourCalculationFn,
    {
      fetchKey: `tour-calculation-${tourId}`,
      tags: [`tour-calculation-${tourId}`],
    }
  );

  const fetchReceiptPaymentsByTourCalculationFn = () =>
    getReceiptPaymentsByTourCalculationIdApi(tourCalculation?.id || '');

  const {
    data: receiptPayments,
    refreshFetch: refreshReceiptPaymentsByTourCalculation,
    isRefreshing: isRefreshingReceiptPaymentsByTourCalculation,
  } = useFetch(
    fetchReceiptPaymentsByTourCalculationFn,
    {
      fetchKey: `organization-receipt-payment-list-in-tour-calculation-${tourCalculation?.id}`,
      tags: [
        `organization-receipt-payment-list-in-tour-calculation-${tourCalculation?.id}`,
      ],
    }
  );

  const tourTicketSummaryData = calculateTourTicketSummaries(
    receiptPayments || [],
    tourCalculation || null
  );

  useImperativeHandle(ref, () => ({
    refreshData: {
      refreshTourCalculation,
      refreshReceiptPaymentsByTourCalculation,
    },
  }));

  return (
    <>
      <TourCalculationTicketSummary
        id={tourCalculation?.id || ''}
        tourId={tourId}
        onUpdated={refreshTourCalculation}
        adultTicketCount={tourCalculation?.adultTicketCount}
        childTicketCount={tourCalculation?.childTicketCount}
        adultTicketPrice={tourCalculation?.adultTicketPrice}
        childTicketPrice={tourCalculation?.childTicketPrice}
        taxRate={tourCalculation?.taxRate}
        totalReceipt={generateLocalePriceFormat(tourTicketSummaryData.totalReceipt)}
        totalPayment={generateLocalePriceFormat(tourTicketSummaryData.totalPayment)}
        totalTaxPay={generateLocalePriceFormat(tourTicketSummaryData.totalTaxPay)}
        netProfitBeforeTaxPay={generateLocalePriceFormat(
          tourTicketSummaryData.netProfitBeforeTaxPay
        )}
        netProfitAfterTaxPay={generateLocalePriceFormat(
          tourTicketSummaryData.netProfitAfterTaxPay
        )}
        profitMarginBeforeTaxPay={generateLocalePriceFormat(
          tourTicketSummaryData.profitMarginBeforeTaxPay
        )}
        profitMarginAfterTaxPay={generateLocalePriceFormat(
          tourTicketSummaryData.profitMarginAfterTaxPay
        )}
      />

      <ReceiptPaymentTourCalculationListContent
        isRefreshing={isRefreshingReceiptPaymentsByTourCalculation}
        receiptPayments={receiptPayments ?? []}
        startDate={startDate}
        endDate={endDate}
        tourCalculationId={tourCalculation?.id}
        organizationId={organizationId}
      />
    </>
  );
}
