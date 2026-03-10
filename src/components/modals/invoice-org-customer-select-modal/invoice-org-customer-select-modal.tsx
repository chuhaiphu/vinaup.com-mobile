import React from 'react';
import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { InvoiceOrgCustomerSelectModalContent } from './invoice-org-customer-select-modal-content';

interface InvoiceOrgCustomerSelectModalProps {
  organizationCustomers: OrganizationCustomerResponse[];
  currentCustomerId?: string;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onSelectCustomer?: (
    type: 'external' | 'organization',
    customerId?: string,
    onSuccessCallback?: () => void
  ) => void;
}

export function InvoiceOrgCustomerSelectModal({
  organizationCustomers,
  currentCustomerId,
  isLoading,
  modalRef,
  onSelectCustomer,
}: InvoiceOrgCustomerSelectModalProps) {
  return (
    <SlideSheet ref={modalRef} heightPercentage={0.7}>
      <InvoiceOrgCustomerSelectModalContent
        organizationCustomers={organizationCustomers}
        currentCustomerId={currentCustomerId}
        isLoading={isLoading}
        onCloseRequest={() => modalRef.current?.close()}
        onSelectCustomer={(type, customerId, onSuccessCallback) =>
          onSelectCustomer?.(type, customerId, onSuccessCallback)
        }
      />
    </SlideSheet>
  );
}
