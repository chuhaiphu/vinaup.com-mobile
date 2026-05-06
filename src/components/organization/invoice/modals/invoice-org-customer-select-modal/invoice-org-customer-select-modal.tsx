import React from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { OrgCustomerSelectModal } from '@/components/commons/modals/organization-customer-select-modal/org-customer-select-modal';
import { useInvoiceDetailContext } from '@/providers/invoice-detail-provider';

interface InvoiceOrgCustomerSelectModalProps {
  modalRef: React.RefObject<SlideSheetRef | null>;
}

export function InvoiceOrgCustomerSelectModal({
  modalRef,
}: InvoiceOrgCustomerSelectModalProps) {
  const { invoice, isUpdatingInvoice, handleUpdateInvoice } =
    useInvoiceDetailContext();

  return (
    <OrgCustomerSelectModal
      modalRef={modalRef}
      organizationId={invoice?.organization?.id ?? ''}
      currentOrganizationCustomerId={invoice?.organizationCustomer?.id ?? ''}
      isBusy={isUpdatingInvoice}
      onConfirm={handleUpdateInvoice}
    />
  );
}
