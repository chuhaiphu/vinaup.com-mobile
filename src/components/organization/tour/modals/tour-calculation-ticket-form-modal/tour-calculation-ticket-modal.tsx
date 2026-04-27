import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import {
  TourCalculationTicketModalContent,
  TourCalculationTicketData,
} from './tour-calculation-ticket-modal-content';

interface TourCalculationTicketModalProps {
  initialData?: Partial<TourCalculationTicketData>;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (
    data: TourCalculationTicketData,
    onSuccessCallback?: () => void
  ) => void;
}

export function TourCalculationTicketModal({
  initialData,
  isLoading,
  modalRef,
  onConfirm,
}: TourCalculationTicketModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <TourCalculationTicketModalContent
        initialData={initialData}
        isLoading={isLoading}
        onCloseRequest={() => modalRef.current?.close()}
        onConfirm={(data) => {
          onConfirm?.(data, () => modalRef.current?.close());
        }}
      />
    </SlideSheet>
  );
}