import { useLocalSearchParams } from 'expo-router';
import { Alert, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useEffect } from 'react';
import { TourDetailHeaderContent } from '@/components/contents/tour/tour-detail-header-content';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import {
  getTourByIdApi,
  getTourCalculationByTourIdApi,
  updateTourApi,
} from '@/apis/tour-apis';
import { UpdateTourRequest } from '@/interfaces/tour-interfaces';
import { TourCalculationTicketSummary } from '@/components/summaries/tour-calculation-ticket-summary';
import { getReceiptPaymentsByTourCalculationIdApi } from '@/apis/receipt-payment-apis';
import { calculateTourTicketSummaries } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { ReceiptPaymentTourCalculationListContent } from '@/components/contents/tour/receipt-payment-tour-calculation-list-content';
import { COLORS } from '@/constants/style-constant';

export default function TourCalculationScreen() {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  const fetchTourFn = () => getTourByIdApi(tourId);
  const {
    data: tour,
    isLoading: isLoadingTour,
    isRefreshing: isRefreshingTour,
    executeFetchFn: fetchTour,
    refreshFetchFn: refreshTour,
  } = useFetchFn(fetchTourFn);

  const fetchTourCalculationFn = () => getTourCalculationByTourIdApi(tourId);
  const {
    data: tourCalculation,
    isRefreshing: isRefreshingTourCalculation,
    executeFetchFn: fetchTourCalculation,
    refreshFetchFn: refreshTourCalculation,
  } = useFetchFn(fetchTourCalculationFn, {
    tags: ['tour-calculation'],
  });

  const fetchReceiptPaymentsByTourCalculationFn = () =>
    getReceiptPaymentsByTourCalculationIdApi(tourCalculation?.id || '');

  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    isRefreshing: isRefreshingReceiptPayments,
    executeFetchFn: fetchReceiptPaymentsByTourCalculation,
    refreshFetchFn: refreshReceiptPaymentsByTourCalculation,
  } = useFetchFn(fetchReceiptPaymentsByTourCalculationFn, {
    tags: ['organization-receipt-payment-list-in-tour-calculation'],
  });

  const updateTourFn = (updatedFields: UpdateTourRequest) =>
    updateTourApi(tourId, updatedFields);

  const { executeMutationFn: updateTour, isMutating: isUpdatingTour } =
    useMutationFn(updateTourFn, {
      invalidatesTags: ['organization-tour-list'],
    });

  const tourTicketSummaryData = calculateTourTicketSummaries(
    receiptPayments || [],
    tourCalculation || null
  );

  useEffect(() => {
    if (tourId) {
      fetchTour();
      fetchTourCalculation();

      if (tourCalculation?.id) {
        fetchReceiptPaymentsByTourCalculation();
      }
    }
  }, [
    tourId,
    tourCalculation?.id,
    fetchTour,
    fetchTourCalculation,
    fetchReceiptPaymentsByTourCalculation,
  ]);

  const handleUpdateTour = (
    updatedFields: UpdateTourRequest,
    onSuccessCallback?: () => void
  ) => {
    if (!tour) return;
    updateTour(updatedFields, {
      onSuccess: () => {
        refreshTour();
        onSuccessCallback?.();
      },
      onError: (error: ApiError) => {
        Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={
            isRefreshingTour ||
            isRefreshingTourCalculation ||
            isRefreshingReceiptPayments
          }
          onRefresh={() => {
            refreshTour();
            refreshTourCalculation();
            refreshReceiptPaymentsByTourCalculation();
          }}
          colors={[COLORS.vinaupTeal]}
          tintColor={COLORS.vinaupTeal}
        />
      }
    >
      <TourDetailHeaderContent
        tour={tour ?? undefined}
        isLoading={isUpdatingTour || isRefreshingTour || isLoadingTour}
        onConfirm={(data, onSuccessCallback) =>
          handleUpdateTour(data, onSuccessCallback)
        }
      />
      <TourCalculationTicketSummary
        id={tourCalculation?.id || ''}
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
      {tour && tourCalculation && (
        <ReceiptPaymentTourCalculationListContent
          receiptPayments={receiptPayments ?? []}
          startDate={tour?.startDate}
          endDate={tour?.endDate}
          loading={isLoadingReceiptPayments}
          tourCalculationId={tourCalculation.id}
          organizationId={tour.organization?.id}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
