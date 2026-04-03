import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { TourSettlementCancelLogModalContent } from './tour-settlement-cancel-log-modal-content';
import { TourResponse } from '@/interfaces/tour-interfaces';

interface TourSettlementCancelLogModalProps {
  tourData: TourResponse;
  modalRef: React.RefObject<SlideSheetRef | null>;
}

export function TourSettlementCancelLogModal({
  tourData,
  modalRef,
}: TourSettlementCancelLogModalProps) {
  return (
    <SlideSheet ref={modalRef} heightPercentage={0.9}>
      <TourSettlementCancelLogModalContent
        tourData={tourData}
        onCloseRequest={() => modalRef.current?.close()}
      />
    </SlideSheet>
  );
}
