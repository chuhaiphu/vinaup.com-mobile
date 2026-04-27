import { getReceiptPaymentsByTourSettlementIdApi } from '@/apis/receipt-payment-apis';
import { getTourSettlementByTourIdApi } from '@/apis/tour-apis';
import { ReceiptPaymentTourSettlementListContent } from '@/components/organization/tour/settlement/receipt-payment-tour-settlement-list-content';
import { TourSettlementTicketSummary } from '@/components/organization/tour/settlement/tour-settlement-ticket-summary';
import { calculateTourTicketSummaries } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { useFetch } from 'fetchwire';
import { useImperativeHandle } from 'react';

interface TourSettlementTicketSummaryReceiptPaymentListContentProps {
  tourId: string;
  startDate?: string;
  endDate?: string;
  organizationId?: string;
  ref?: React.Ref<{
    refreshData: {
      refreshTourSettlement: () => void;
      refreshReceiptPaymentsByTourSettlement: () => void;
    };
  }>;
}

export function TourSettlementTicketSummaryReceiptPaymentListContent({
  tourId,
  startDate,
  endDate,
  organizationId,
  ref,
}: TourSettlementTicketSummaryReceiptPaymentListContentProps) {
  const { data: tourSettlement, refreshFetch: refreshTourSettlement } = useFetch(
    () => getTourSettlementByTourIdApi(tourId),
    {
      fetchKey: `tour-settlement-${tourId}`,
      tags: [`tour-settlement-${tourId}`],
    }
  );

  const {
    data: receiptPayments,
    refreshFetch: refreshReceiptPaymentsByTourSettlement,
    isRefreshing: isRefreshingReceiptPaymentsByTourSettlement,
  } = useFetch(
    () => getReceiptPaymentsByTourSettlementIdApi(tourSettlement?.id || ''),
    {
      fetchKey: `organization-receipt-payment-list-in-tour-settlement-${tourSettlement?.id}`,
      tags: [
        `organization-receipt-payment-list-in-tour-settlement-${tourSettlement?.id}`,
      ],
    }
  );

  const tourTicketSummaryData = calculateTourTicketSummaries(
    receiptPayments || [],
    tourSettlement || null
  );

  useImperativeHandle(ref, () => ({
    refreshData: {
      refreshTourSettlement,
      refreshReceiptPaymentsByTourSettlement,
    },
  }));

  return (
    <>
      <TourSettlementTicketSummary
        id={tourSettlement?.id || ''}
        tourId={tourId}
        onUpdated={refreshTourSettlement}
        adultTicketCount={tourSettlement?.adultTicketCount}
        childTicketCount={tourSettlement?.childTicketCount}
        adultTicketPrice={tourSettlement?.adultTicketPrice}
        childTicketPrice={tourSettlement?.childTicketPrice}
        taxRate={tourSettlement?.taxRate}
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
      <ReceiptPaymentTourSettlementListContent
        isRefreshing={isRefreshingReceiptPaymentsByTourSettlement}
        receiptPayments={receiptPayments ?? []}
        startDate={startDate}
        endDate={endDate}
        tourSettlementId={tourSettlement?.id || ''}
        organizationId={organizationId}
      />
    </>
  );
}
