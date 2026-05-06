import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { OrganizationMemberResponse } from '@/interfaces/organization-member-interfaces';
import { MemberInChargeTourImplementationResponse } from '@/interfaces/tour-implementation-interfaces';
import { OrgMemSelectModalContent } from './org-mem-select-modal-content';

interface OrgMemSelectModalProps {
  organizationMembers?: OrganizationMemberResponse[] | null;
  membersInCharge?: MemberInChargeTourImplementationResponse[] | null;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (
    selectedOrgMemberIds: string[], 
    onSuccessCallback?: () => void
  ) => void;
}

export function OrgMemSelectModal({
  organizationMembers,
  membersInCharge,
  isLoading,
  modalRef,
  onConfirm,
}: OrgMemSelectModalProps) {
  const handleClose = () => {
    modalRef.current?.close();
  };

  return (
    <SlideSheet ref={modalRef}>
      <OrgMemSelectModalContent
        isLoading={isLoading}
        organizationMembers={organizationMembers}
        membersInCharge={membersInCharge}
        onConfirm={onConfirm}
        onClose={handleClose}
      />
    </SlideSheet>
  );
}
