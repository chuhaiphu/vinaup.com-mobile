import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import {
  TourImplementationTicketCountModalContent,
  TourImplementationTicketCountData,
} from './tour-implementation-ticket-count-modal-content';

interface TourImplementationTicketCountModalProps {
  initialData?: Partial<TourImplementationTicketCountData>;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (
    data: TourImplementationTicketCountData,
    onSuccessCallback?: () => void
  ) => void;
}

export function TourImplementationTicketCountModal({
  initialData,
  isLoading,
  modalRef,
  onConfirm,
}: TourImplementationTicketCountModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <TourImplementationTicketCountModalContent
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
