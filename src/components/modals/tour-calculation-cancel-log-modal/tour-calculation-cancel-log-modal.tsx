import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { TourCalculationCancelLogModalContent } from './tour-calculation-cancel-log-modal-content';

interface TourCalculationCancelLogModalProps {
  tourCalculationId: string;
  modalRef: React.RefObject<SlideSheetRef | null>;
}

export function TourCalculationCancelLogModal({
  tourCalculationId,
  modalRef,
}: TourCalculationCancelLogModalProps) {
  return (
    <SlideSheet ref={modalRef} heightPercentage={0.9}>
      <TourCalculationCancelLogModalContent
        tourCalculationId={tourCalculationId}
        onCloseRequest={() => modalRef.current?.close()}
      />
    </SlideSheet>
  );
}
