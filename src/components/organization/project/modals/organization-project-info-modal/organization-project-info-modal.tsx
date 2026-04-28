import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { OrganizationProjectInfoModalContent } from './organization-project-info-modal-content';

interface OrganizationProjectInfoModalProps {
  project: ProjectResponse;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (
    data: {
      description: string;
      startDate: string;
      endDate: string;
      code?: string;
    },
    onSuccessCallback?: () => void
  ) => void;
}

export function OrganizationProjectInfoModal({
  project,
  isLoading,
  modalRef,
  onConfirm,
}: OrganizationProjectInfoModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <OrganizationProjectInfoModalContent
        prjCode={project.code ?? undefined}
        prjDescription={project.description}
        prjStartDate={project.startDate}
        prjEndDate={project.endDate}
        isLoading={isLoading}
        onCloseRequest={() => modalRef.current?.close()}
        onConfirm={(data) => {
          onConfirm?.(data, () => modalRef.current?.close());
        }}
      />
    </SlideSheet>
  );
}
