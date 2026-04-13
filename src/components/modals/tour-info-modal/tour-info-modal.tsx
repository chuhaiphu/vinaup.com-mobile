import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { TourResponse } from '@/interfaces/tour-interfaces';
import { TourInfoModalContent } from './tour-info-modal-content';

interface TourInfoModalProps {
  tour: TourResponse;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (
    data: {
      description: string;
      startDate: string;
      endDate: string;
    },
    onSuccessCallback?: () => void
  ) => void;
}

export function TourInfoModal({
  tour,
  isLoading,
  modalRef,
  onConfirm,
}: TourInfoModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <TourInfoModalContent
        tourDescription={tour.description}
        tourStartDate={tour.startDate}
        tourEndDate={tour.endDate}
        isLoading={isLoading}
        onCloseRequest={() => modalRef.current?.close()}
        onConfirm={(data) => {
          onConfirm?.(data, () => modalRef.current?.close());
        }}
      />
    </SlideSheet>
  );
}
