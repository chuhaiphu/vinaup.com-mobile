import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { SimpleTextInputModalContent } from './simple-text-input-modal-content';

interface SimpleTextInputModalProps {
  maxLength?: number;
  value?: string | null;
  placeholder?: string;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (value: string, onSuccessClose?: () => void) => void;
}

export function SimpleTextInputModal({
  maxLength,
  value,
  placeholder,
  isLoading,
  modalRef,
  onConfirm,
}: SimpleTextInputModalProps) {
  const handleClose = () => {
    modalRef.current?.close();
  };

  return (
    <SlideSheet ref={modalRef}>
      <SimpleTextInputModalContent
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        isLoading={isLoading}
        onCloseRequest={handleClose}
        onConfirm={(val) => {
          onConfirm?.(val, handleClose);
        }}
      />
    </SlideSheet>
  );
}

