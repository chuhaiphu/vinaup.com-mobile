import React from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { OrgCustomerSelectModal } from '@/components/commons/modals/organization-customer-select-modal/org-customer-select-modal';
import { useBookingDetailContext } from '@/providers/booking-detail-provider';

interface BookingOrgCustomerSelectModalProps {
  modalRef: React.RefObject<SlideSheetRef | null>;
}

export function BookingOrgCustomerSelectModal({
  modalRef,
}: BookingOrgCustomerSelectModalProps) {
  const { booking, isUpdatingBooking, handleUpdateBooking } =
    useBookingDetailContext();

  return (
    <OrgCustomerSelectModal
      modalRef={modalRef}
      organizationId={booking?.organization?.id ?? ''}
      currentOrganizationCustomerId={booking?.organizationCustomer?.id ?? ''}
      isBusy={isUpdatingBooking}
      onConfirm={handleUpdateBooking}
    />
  );
}
