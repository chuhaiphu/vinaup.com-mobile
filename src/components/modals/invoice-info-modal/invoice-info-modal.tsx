import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import { InvoiceInfoModalContent } from './invoice-info-modal-content';

interface InvoiceInfoModalProps {
  invoice: InvoiceResponse;
  isLoading?: boolean;
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

export function InvoiceInfoModal({
  invoice,
  isLoading,
  modalRef,
  onConfirm,
}: InvoiceInfoModalProps) {
  return (
    <SlideSheet ref={modalRef}>
      <InvoiceInfoModalContent
        invCode={invoice.code}
        invDescription={invoice.description}
        invStartDate={invoice.startDate}
        isLoading={isLoading}
        onCloseRequest={() => modalRef.current?.close()}
        onConfirm={(data) => {
          onConfirm?.(data, () => modalRef.current?.close());
        }}
      />
    </SlideSheet>
  );
}

