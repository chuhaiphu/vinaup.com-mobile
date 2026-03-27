import React from 'react';
import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { InvoiceOrgCustomerSelectModalContent } from './invoice-org-customer-select-modal-content';

interface InvoiceOrgCustomerSelectModalProps {
  modalRef: React.RefObject<SlideSheetRef | null>;
}

export function InvoiceOrgCustomerSelectModal({
  modalRef,
}: InvoiceOrgCustomerSelectModalProps) {
  return (
    <SlideSheet ref={modalRef} heightPercentage={0.78}>
      <InvoiceOrgCustomerSelectModalContent
        onCloseRequest={() => modalRef.current?.close()}
      />
    </SlideSheet>
  );
}
