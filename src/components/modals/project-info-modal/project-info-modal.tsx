import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { ProjectInfoModalContent } from './project-info-modal-content';

interface ProjectInfoModalProps {
  project: ProjectResponse;
  isLoading?: boolean;
  contentKey: number;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (
    data: {
      description: string;
      startDate: Date;
      endDate: Date;
      code?: string;
    },
    onSuccessCallback?: () => void
  ) => void;
}

export function ProjectInfoModal({
  project,
  isLoading,
  contentKey,
  modalRef,
  onConfirm,
}: ProjectInfoModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <ProjectInfoModalContent
        key={contentKey}
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

