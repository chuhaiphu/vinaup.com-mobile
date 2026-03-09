import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { InvoiceOrgCustomerEditModalContent } from './invoice-org-customer-edit-modal-content';

interface InvoiceOrgCustomerEditModalProps {
  organizationId?: string;
  organizationName?: string;
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

export function InvoiceOrgCustomerEditModal({
  organizationId,
  organizationName,
  organizationCustomers,
  currentCustomerId,
  isLoading,
  modalRef,
  onSelectCustomer,
}: InvoiceOrgCustomerEditModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <InvoiceOrgCustomerEditModalContent
        organizationId={organizationId}
        organizationName={organizationName}
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
