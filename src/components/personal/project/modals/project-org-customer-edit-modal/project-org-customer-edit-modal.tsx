import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { ProjectOrgCustomerEditModalContent } from './project-org-customer-edit-modal-content';

interface ProjectOrgCustomerEditModalProps {
  organizationName?: string | null;
  customerName?: string | null;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (
    organizationName: string,
    customerName: string,
    onSuccessCallback?: () => void
  ) => void;
}

export function ProjectOrgCustomerEditModal({
  organizationName,
  customerName,
  isLoading,
  modalRef,
  onConfirm,
}: ProjectOrgCustomerEditModalProps) {
  const handleClose = () => {
    modalRef.current?.close();
  };

  return (
    <SlideSheet ref={modalRef}>
      <ProjectOrgCustomerEditModalContent
        organizationName={organizationName}
        customerName={customerName}
        isLoading={isLoading}
        onCloseRequest={handleClose}
        onConfirm={(orgName, cusName) =>
          onConfirm?.(orgName, cusName, handleClose)
        }
      />
    </SlideSheet>
  );
}

