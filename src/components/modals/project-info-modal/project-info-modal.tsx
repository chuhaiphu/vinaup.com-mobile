import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { ProjectInfoModalContent } from './project-info-modal-content';

interface ProjectInfoModalProps {
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

export function ProjectInfoModal({
  project,
  isLoading,
  modalRef,
  onConfirm,
}: ProjectInfoModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <ProjectInfoModalContent
        prjCode={project.code}
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

