import React, { useEffect } from 'react';
import { useFetchFn } from 'fetchwire';
import { getTourImplementationByTourIdApi } from '@/apis/tour-apis';
import { getReceiptPaymentsByTourImplementationIdApi } from '@/apis/receipt-payment-apis';
import { TourResponse } from '@/interfaces/tour-interfaces';
import { ReceiptPaymentTourImplementationTourGuideListContent } from './receipt-payment-tour-implementation-tour-guide-list-content';

interface Props {
  tour: TourResponse | undefined;
}

export function TourImplementationTourGuideTabPanelContent({ tour }: Props) {
  const {
    data: tourImplementation,
    executeFetchFn: fetchTourImplementation,
  } = useFetchFn(
    () => getTourImplementationByTourIdApi(tour?.id || ''),
    { tags: [`tour-implementation-${tour?.id}`] }
  );

  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
  } = useFetchFn(
    () => getReceiptPaymentsByTourImplementationIdApi(tourImplementation?.id || '', 'FOR_TOUR_GUIDE'),
    { tags: ['organization-receipt-payment-list-in-tour-implementation'] }
  );

  useEffect(() => {
    if (tour?.id) fetchTourImplementation();
  }, [tour?.id, fetchTourImplementation]);

  useEffect(() => {
    if (tourImplementation?.id) fetchReceiptPayments();
  }, [tourImplementation?.id, fetchReceiptPayments]);

  if (!tour || !tourImplementation) return null;

  return (
    <ReceiptPaymentTourImplementationTourGuideListContent
      receiptPayments={receiptPayments ?? []}
      startDate={tour.startDate}
      endDate={tour.endDate}
      loading={isLoadingReceiptPayments}
      tourImplementationId={tourImplementation.id}
      organizationId={tour.organization?.id}
    />
  );
}
