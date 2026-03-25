import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { TourCalculationCancelLogModalContent } from './tour-calculation-cancel-log-modal-content';
import { TourResponse } from '@/interfaces/tour-interfaces';

interface TourCalculationCancelLogModalProps {
  tourData: TourResponse;
  modalRef: React.RefObject<SlideSheetRef | null>;
}

export function TourCalculationCancelLogModal({
  tourData,
  modalRef,
}: TourCalculationCancelLogModalProps) {
  return (
    <SlideSheet ref={modalRef} heightPercentage={0.9}>
      <TourCalculationCancelLogModalContent
        tourData={tourData}
        onCloseRequest={() => modalRef.current?.close()}
      />
    </SlideSheet>
  );
}
