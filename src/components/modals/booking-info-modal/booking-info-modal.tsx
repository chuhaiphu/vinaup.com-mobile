import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { BookingResponse } from '@/interfaces/booking-interfaces';
import { BookingInfoModalContent } from './booking-info-modal-content';

interface BookingInfoModalProps {
  booking: BookingResponse;
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

export function BookingInfoModal({
  booking,
  isLoading,
  modalRef,
  onConfirm,
}: BookingInfoModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <BookingInfoModalContent
        bookingDescription={booking.description}
        bookingStartDate={booking.startDate}
        bookingEndDate={booking.endDate}
        isLoading={isLoading}
        onCloseRequest={() => modalRef.current?.close()}
        onConfirm={(data) => {
          onConfirm?.(data, () => modalRef.current?.close());
        }}
      />
    </SlideSheet>
  );
}
