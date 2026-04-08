import { StyleSheet, ScrollView, RefreshControl, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { TourDetailFooterContent } from '@/components/contents/tour/tour-detail-footer-content';
import TourCalculationSignatureContent from '@/components/contents/tour/tour-calculation/tour-calculation-signature-section-content';
import { TourDetailHeaderContent } from '@/components/contents/tour/tour-detail-header-content';
import { Suspense, useRef, useState } from 'react';
import { TourCalculationSignatureInfoPopover } from '@/components/popovers/tour-calculation-signature-info-popover';
import { useTourDetailContext } from '@/providers/tour-detail-provider';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';
import { TourCalculationTicketSummaryReceiptPaymentListContent } from '@/components/contents/tour/tour-calculation-ticket-summary-receipt-payment-list-content';
import { WhitePaneSkeleton } from '@/components/skeletons/white-pane-skeleton';
import { EntityListSectionSkeleton } from '@/components/skeletons/entity-list-section-skeleton';

function TourCalculationScreenContent() {
  const [isSignatureInfoPopoverVisible, setIsSignatureInfoPopoverVisible] =
    useState(false);

  const {
    tourId,
    tour,
    isRefreshingTour,
    isUpdatingTour,
    handleUpdateTour,
    refreshTour,
  } = useTourDetailContext();

  const tourCalculationTicketSummaryReceiptPaymentListContentRef = useRef<{
    refreshData: {
      refreshTourCalculation: () => void;
      refreshReceiptPaymentsByTourCalculation: () => void;
    };
  }>(null);

  const handleRefresh = () => {
    refreshTour();
    tourCalculationTicketSummaryReceiptPaymentListContentRef.current?.refreshData.refreshTourCalculation();
    tourCalculationTicketSummaryReceiptPaymentListContentRef.current?.refreshData.refreshReceiptPaymentsByTourCalculation();
  };

  return (
    <OrganizationCustomerProvider organizationId={tour?.organization?.id}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingTour}
              onRefresh={handleRefresh}
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
          <Suspense
            fallback={
              <>
                <WhitePaneSkeleton height={200} />
                <EntityListSectionSkeleton />
              </>
            }
          >
            <TourCalculationTicketSummaryReceiptPaymentListContent
              tourId={tourId}
              startDate={tour?.startDate}
              endDate={tour?.endDate}
              organizationId={tour?.organization?.id}
            />
            <TourDetailFooterContent />
          </Suspense>
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
