import { useLocalSearchParams } from 'expo-router';
import {
  Alert,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Text,
} from 'react-native';
import { useEffect } from 'react';
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
import { TourDetailFooterContent } from '@/components/contents/tour/tour-detail-footer-content';
import TourCalculationSignatureContent from '@/components/contents/tour/tour-calculation-signature-section-content';
import { Select } from '@/components/primitives/select';
import { TourStatus, TourStatusOptions } from '@/constants/tour-constants';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { TourDetailHeaderContent } from '@/components/contents/tour/tour-detail-header-content';

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
        <TourDetailFooterContent
          tour={tour ?? undefined}
          isLoading={isLoadingTour}
          onConfirm={(data, onSuccessCallback) =>
            handleUpdateTour(data, onSuccessCallback)
          }
        />
      </ScrollView>
      <View style={styles.tourCalculationSignatureContainer}>
        <TourCalculationSignatureContent
          organizationId={tour?.organization?.id || ''}
          tourCalculationId={tour?.tourCalculation?.id || ''}
        />
      </View>
    </View>
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
