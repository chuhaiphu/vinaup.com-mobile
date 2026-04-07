import { StyleSheet, ScrollView, RefreshControl, View } from 'react-native';
import { useFetchFn } from 'fetchwire';
import { getTourCalculationByTourIdApi } from '@/apis/tour-apis';
import { TourCalculationTicketSummary } from '@/components/summaries/tour-calculation-ticket-summary';
import { getReceiptPaymentsByTourCalculationIdApi } from '@/apis/receipt-payment-apis';
import { calculateTourTicketSummaries } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { ReceiptPaymentTourCalculationListContent } from '@/components/contents/tour/receipt-payment-tour-calculation-list-content';
import { COLORS } from '@/constants/style-constant';
import { TourDetailFooterContent } from '@/components/contents/tour/tour-detail-footer-content';
import TourCalculationSignatureContent from '@/components/contents/tour/tour-calculation/tour-calculation-signature-section-content';
import { TourDetailHeaderContent } from '@/components/contents/tour/tour-detail-header-content';
import { useEffect, useState } from 'react';
import { TourCalculationSignatureInfoPopover } from '@/components/popovers/tour-calculation-signature-info-popover';
import { useTourContext } from '@/providers/tour-provider';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';

function TourCalculationScreenContent() {
  const [isSignatureInfoPopoverVisible, setIsSignatureInfoPopoverVisible] =
    useState(false);

  const { tour, isRefreshingTour, isUpdatingTour, handleUpdateTour, refreshTour } =
    useTourContext();

  const tourId = tour?.id || '';

  const fetchTourCalculationFn = () => getTourCalculationByTourIdApi(tourId);
  const {
    data: tourCalculation,
    isRefreshing: isRefreshingTourCalculation,
    executeFetchFn: fetchTourCalculation,
    refreshFetchFn: refreshTourCalculation,
  } = useFetchFn(fetchTourCalculationFn, {
    tags: [`tour-calculation-${tourId}`],
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

  const tourTicketSummaryData = calculateTourTicketSummaries(
    receiptPayments || [],
    tourCalculation || null
  );

  useEffect(() => {
    if (tourId) {
      fetchTourCalculation();

      if (tourCalculation?.id) {
        fetchReceiptPaymentsByTourCalculation();
      }
    }
  }, [
    tourId,
    tourCalculation?.id,
    fetchTourCalculation,
    fetchReceiptPaymentsByTourCalculation,
  ]);

  return (
    <OrganizationCustomerProvider organizationId={tour?.organization?.id}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
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
            isLoading={isUpdatingTour || isRefreshingTour}
            onConfirm={(data, onSuccessCallback) =>
              handleUpdateTour(data, onSuccessCallback)
            }
          />
          <TourCalculationTicketSummary
            id={tourCalculation?.id || ''}
            tourId={tourId}
            adultTicketCount={tourCalculation?.adultTicketCount}
            childTicketCount={tourCalculation?.childTicketCount}
            adultTicketPrice={tourCalculation?.adultTicketPrice}
            childTicketPrice={tourCalculation?.childTicketPrice}
            taxRate={tourCalculation?.taxRate}
            totalReceipt={generateLocalePriceFormat(
              tourTicketSummaryData.totalReceipt
            )}
            totalPayment={generateLocalePriceFormat(
              tourTicketSummaryData.totalPayment
            )}
            totalTaxPay={generateLocalePriceFormat(
              tourTicketSummaryData.totalTaxPay
            )}
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
          <TourDetailFooterContent />
        </ScrollView>
        <View style={styles.tourCalculationSignatureWrapper}>
          <TourCalculationSignatureInfoPopover
            isVisible={isSignatureInfoPopoverVisible}
            onClose={() => setIsSignatureInfoPopoverVisible(false)}
            containerStyle={styles.signatureInfoPopoverContainer}
          />
          <View style={styles.tourCalculationSignatureContainer}>
            {tour && (
              <TourCalculationSignatureContent
                tourData={tour}
                onOpenSignatureInfoPopover={() =>
                  setIsSignatureInfoPopoverVisible(true)
                }
              />
            )}
          </View>
        </View>
      </View>
    </OrganizationCustomerProvider>
  );
}

export default function TourCalculationScreen() {
  return <TourCalculationScreenContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {},
  tourCalculationSignatureWrapper: {
    overflow: 'visible',
  },
  signatureInfoPopoverContainer: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  tourCalculationSignatureContainer: {
    backgroundColor: COLORS.vinaupLightGreen,
    paddingHorizontal: 8,
    borderRadius: 8,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
});
