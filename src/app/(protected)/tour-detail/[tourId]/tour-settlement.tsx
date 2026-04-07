import { StyleSheet, ScrollView, RefreshControl, View } from 'react-native';
import { useFetchFn } from 'fetchwire';
import { getTourSettlementByTourIdApi } from '@/apis/tour-apis';
import { TourSettlementTicketSummary } from '@/components/summaries/tour-settlement-ticket-summary';
import { getReceiptPaymentsByTourSettlementIdApi } from '@/apis/receipt-payment-apis';
import { calculateTourTicketSummaries } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { ReceiptPaymentTourSettlementListContent } from '@/components/contents/tour/receipt-payment-tour-settlement-list-content';
import { COLORS } from '@/constants/style-constant';
import { TourDetailFooterContent } from '@/components/contents/tour/tour-detail-footer-content';
import TourSettlementSignatureContent from '@/components/contents/tour/tour-settlement/tour-settlement-signature-section-content';
import { TourDetailHeaderContent } from '@/components/contents/tour/tour-detail-header-content';
import { useEffect, useState } from 'react';
import { TourCalculationSignatureInfoPopover } from '@/components/popovers/tour-calculation-signature-info-popover';
import { useTourContext } from '@/providers/tour-provider';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';

function TourSettlementScreenContent() {
  const [isSignatureInfoPopoverVisible, setIsSignatureInfoPopoverVisible] =
    useState(false);

  const { tour, isRefreshingTour, isUpdatingTour, handleUpdateTour, refreshTour } =
    useTourContext();

  const tourId = tour?.id || '';

  const fetchTourSettlementFn = () => getTourSettlementByTourIdApi(tourId);
  const {
    data: tourSettlement,
    isRefreshing: isRefreshingTourSettlement,
    executeFetchFn: fetchTourSettlement,
    refreshFetchFn: refreshTourSettlement,
  } = useFetchFn(fetchTourSettlementFn, {
    tags: [`tour-settlement-${tourId}`],
  });

  const fetchReceiptPaymentsByTourSettlementFn = () =>
    getReceiptPaymentsByTourSettlementIdApi(tourSettlement?.id || '');

  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    isRefreshing: isRefreshingReceiptPayments,
    executeFetchFn: fetchReceiptPaymentsByTourSettlement,
    refreshFetchFn: refreshReceiptPaymentsByTourSettlement,
  } = useFetchFn(fetchReceiptPaymentsByTourSettlementFn, {
    tags: ['organization-receipt-payment-list-in-tour-settlement'],
  });

  const tourTicketSummaryData = calculateTourTicketSummaries(
    receiptPayments || [],
    tourSettlement || null
  );

  useEffect(() => {
    if (tourId) {
      fetchTourSettlement();

      if (tourSettlement?.id) {
        fetchReceiptPaymentsByTourSettlement();
      }
    }
  }, [
    tourId,
    tourSettlement?.id,
    fetchTourSettlement,
    fetchReceiptPaymentsByTourSettlement,
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
                isRefreshingTourSettlement ||
                isRefreshingReceiptPayments
              }
              onRefresh={() => {
                refreshTour();
                refreshTourSettlement();
                refreshReceiptPaymentsByTourSettlement();
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
          <TourSettlementTicketSummary
            id={tourSettlement?.id || ''}
            tourId={tourId}
            adultTicketCount={tourSettlement?.adultTicketCount}
            childTicketCount={tourSettlement?.childTicketCount}
            adultTicketPrice={tourSettlement?.adultTicketPrice}
            childTicketPrice={tourSettlement?.childTicketPrice}
            taxRate={tourSettlement?.taxRate}
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
          {tour && tourSettlement && (
            <ReceiptPaymentTourSettlementListContent
              receiptPayments={receiptPayments ?? []}
              startDate={tour?.startDate}
              endDate={tour?.endDate}
              loading={isLoadingReceiptPayments}
              tourSettlementId={tourSettlement.id}
              organizationId={tour.organization?.id}
            />
          )}
          <TourDetailFooterContent />
        </ScrollView>
        <View style={styles.tourSettlementSignatureWrapper}>
          <TourCalculationSignatureInfoPopover
            isVisible={isSignatureInfoPopoverVisible}
            onClose={() => setIsSignatureInfoPopoverVisible(false)}
            containerStyle={styles.signatureInfoPopoverContainer}
          />
          <View style={styles.tourSettlementSignatureContainer}>
            {tour && (
              <TourSettlementSignatureContent
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

export default function TourSettlementScreen() {
  return <TourSettlementScreenContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {},
  tourSettlementSignatureWrapper: {
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
  tourSettlementSignatureContainer: {
    backgroundColor: COLORS.vinaupLightGreen,
    paddingHorizontal: 8,
    borderRadius: 8,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
});
