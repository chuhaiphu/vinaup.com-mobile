import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { OrganizationProjectNoteEditModalContent } from './organization-project-note-edit-modal-content';

interface OrganizationProjectNoteEditModalProps {
  maxLength?: number;
  value?: string | null;
  placeholder?: string;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (value: string, onSuccessClose?: () => void) => void;
}

export function OrganizationProjectNoteEditModal({
  maxLength,
  value,
  placeholder,
  isLoading,
  modalRef,
  onConfirm,
}: OrganizationProjectNoteEditModalProps) {
  const handleClose = () => {
    modalRef.current?.close();
  };

  return (
    <SlideSheet ref={modalRef}>
      <OrganizationProjectNoteEditModalContent
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
