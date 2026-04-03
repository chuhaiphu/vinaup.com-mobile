import React, { useEffect } from 'react';
import { useFetchFn } from 'fetchwire';
import { getTourImplementationByTourIdApi } from '@/apis/tour-apis';
import { getReceiptPaymentsByTourImplementationIdApi } from '@/apis/receipt-payment-apis';
import { TourResponse } from '@/interfaces/tour-interfaces';
import { ReceiptPaymentTourImplementationDirectorListContent } from './receipt-payment-tour-implementation-director-list-content';

interface Props {
  tour: TourResponse | undefined;
}

export function TourImplementationDirectorTabPanelContent({ tour }: Props) {
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
    () => getReceiptPaymentsByTourImplementationIdApi(tourImplementation?.id || '', 'FOR_DIRECTOR'),
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
    <ReceiptPaymentTourImplementationDirectorListContent
      receiptPayments={receiptPayments ?? []}
      startDate={tour.startDate}
      endDate={tour.endDate}
      loading={isLoadingReceiptPayments}
      tourImplementationId={tourImplementation.id}
      organizationId={tour.organization?.id}
    />
  );
}
