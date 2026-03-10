import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { CreateOrganizationCustomerModalContent } from './create-organization-customer-modal-content';

interface CreateOrganizationCustomerModalProps {
  organizationId?: string;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onCreated?: (customer: OrganizationCustomerResponse) => void;
}

export function CreateOrganizationCustomerModal({
  organizationId,
  modalRef,
  onCreated,
}: CreateOrganizationCustomerModalProps) {
  const handleClose = () => {
    modalRef.current?.close();
  };

  return (
    <SlideSheet ref={modalRef} heightPercentage={0.5}>
      <CreateOrganizationCustomerModalContent
        organizationId={organizationId}
        onCreated={(customer) => {
          onCreated?.(customer);
          handleClose();
        }}
        onCloseRequest={handleClose}
      />
    </SlideSheet>
  );
}
