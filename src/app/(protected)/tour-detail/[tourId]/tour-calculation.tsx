import { useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Text,
} from 'react-native';
import { useFetchFn } from 'fetchwire';
import {
  getTourCalculationByTourIdApi,
} from '@/apis/tour-apis';
import { TourCalculationTicketSummary } from '@/components/summaries/tour-calculation-ticket-summary';
import { getReceiptPaymentsByTourCalculationIdApi } from '@/apis/receipt-payment-apis';
import { calculateTourTicketSummaries } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { ReceiptPaymentTourCalculationListContent } from '@/components/contents/tour/receipt-payment-tour-calculation-list-content';
import { COLORS } from '@/constants/style-constant';
import { TourDetailFooterContent } from '@/components/contents/tour/tour-detail-footer-content';
import TourCalculationSignatureContent from '@/components/contents/tour/tour-calculation-signature-section-content';
import { Select } from '@/components/primitives/select';
import { TourStatus, TourStatusOptions } from '@/constants/tour-constants';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { TourDetailHeaderContent } from '@/components/contents/tour/tour-detail-header-content';
import { useEffect, useState } from 'react';
import { TourCalculationSignatureInfoPopover } from '@/components/popovers/tour-calculation-signature-info-popover';
import { TourCalculationProvider, useTourCalculationContext } from '@/providers/tour-calculation-provider';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';

function TourCalculationScreenContent() {
  const [isSignatureInfoPopoverVisible, setIsSignatureInfoPopoverVisible] =
    useState(false);

  const {
    tour,
    isRefreshingTour,
    isUpdatingTour,
    handleUpdateTour,
    refreshTour,
  } = useTourCalculationContext();

  const { tourId } = useLocalSearchParams<{ tourId: string }>();

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
          <View style={styles.actionContainer}>
            <View style={styles.statusFilter}>
              <Select
                renderTrigger={(option) => (
                  <>
                    <VinaupVerticalExpandArrow width={16} height={16} />
                    <Text style={{ color: COLORS.vinaupTeal }}>
                      {option.label || 'Trạng thái'}
                    </Text>
                  </>
                )}
                isLoading={isUpdatingTour || isRefreshingTour}
                options={TourStatusOptions}
                value={tour?.status || ''}
                onChange={(value) =>
                  handleUpdateTour({ status: value as TourStatus })
                }
                placeholder="Trạng thái"
                style={{
                  triggerText: {
                    fontSize: 16,
                    color: COLORS.vinaupTeal,
                  },
                }}
              />
            </View>
            <View style={styles.actionButton}>
              <PressableOpacity style={styles.actionButtonItem}>
                <Text style={styles.actionButtonItemText}>Tour</Text>
              </PressableOpacity>
              <PressableOpacity style={styles.actionButtonItem}>
                <FontAwesome5 name="copy" size={18} color={COLORS.vinaupTeal} />
              </PressableOpacity>
              <PressableOpacity style={styles.actionButtonItem}>
                <Entypo
                  name="dots-three-horizontal"
                  size={18}
                  color={COLORS.vinaupTeal}
                />
              </PressableOpacity>
            </View>
          </View>
          <TourDetailHeaderContent
            tour={tour ?? undefined}
            isLoading={isUpdatingTour || isRefreshingTour}
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
            totalReceipt={generateLocalePriceFormat(
              tourTicketSummaryData.totalReceipt
            )}
            totalPayment={generateLocalePriceFormat(
              tourTicketSummaryData.totalPayment
            )}
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
  const { tourId } = useLocalSearchParams<{ tourId: string }>();

  return (
    <TourCalculationProvider tourId={tourId}>
      <TourCalculationScreenContent />
    </TourCalculationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionContainer: {
    marginVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonItem: {},
  actionButtonItemText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
});
