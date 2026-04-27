import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { SignerSelectModalContent } from './signer-select-modal-content';
import { OrganizationMemberResponse } from '@/interfaces/organization-member-interfaces';
import { SignatureResponse } from '@/interfaces/signature-interfaces';

interface SignerSelectModalProps {
  organizationMembers?: OrganizationMemberResponse[] | null;
  receiverSignatures?: SignatureResponse[] | null;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (
    selectedOrganizationMemberIds: string[],
    onSuccessCallback?: () => void
  ) => void;
}

export function SignerSelectModal({
  organizationMembers,
  receiverSignatures,
  isLoading,
  modalRef,
  onConfirm,
}: SignerSelectModalProps) {
  const handleClose = () => {
    modalRef.current?.close();
  };
  return (
    <SlideSheet ref={modalRef}>
      <SignerSelectModalContent
        isLoading={isLoading}
        organizationMembers={organizationMembers}
        receiverSignatures={receiverSignatures}
        onClose={handleClose}
        onConfirm={onConfirm}
      />
    </SlideSheet>
  );
}
