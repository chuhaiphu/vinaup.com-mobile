import React from 'react';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { OrgCustomerSelectModal } from '@/components/commons/modals/organization-customer-select-modal/org-customer-select-modal';
import { useOrganizationProjectDetailContext } from '@/providers/organization-project-detail-provider';

interface OrganizationProjectOrgCustomerSelectModalProps {
  modalRef: React.RefObject<SlideSheetRef | null>;
}

export function OrganizationProjectOrgCustomerSelectModal({
  modalRef,
}: OrganizationProjectOrgCustomerSelectModalProps) {
  const { project, isUpdatingProject, handleUpdateProject } =
    useOrganizationProjectDetailContext();

  return (
    <OrgCustomerSelectModal
      modalRef={modalRef}
      organizationId={project?.organization?.id ?? ''}
      currentOrganizationCustomerId={project?.organizationCustomer?.id ?? ''}
      isBusy={isUpdatingProject}
      onConfirm={handleUpdateProject}
    />
  );
}
