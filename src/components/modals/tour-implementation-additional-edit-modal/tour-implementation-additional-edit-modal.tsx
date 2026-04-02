import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { TourImplementationAdditionalDataResponse } from '@/interfaces/tour-implementation-interfaces';
import { TourImplementationAdditionalEditModalContent } from './tour-implementation-additional-edit-modal-content';

export interface AdditionalEditFormData {
  additionalDataId: string;
  position: number;
  carName: string;
  tourGuide: {
    id: string;
    currentOption: number;
    customUserName: string;
    customPhone: string;
    userId: string | null;
  };
  driver: {
    id: string;
    currentOption: number;
    customUserName: string;
    customPhone: string;
    userId: string | null;
  };
}

interface Props {
  modalRef: React.RefObject<SlideSheetRef | null>;
  selectedItem: TourImplementationAdditionalDataResponse | null;
  allAdditionalData: TourImplementationAdditionalDataResponse[] | undefined;
  isLoading?: boolean;
  onConfirm?: (data: AdditionalEditFormData, onClose: () => void) => void;
}

export function TourImplementationAdditionalEditModal({
  modalRef,
  selectedItem,
  allAdditionalData,
  isLoading,
  onConfirm,
}: Props) {
  const handleClose = () => {
    modalRef.current?.close();
  };

  if (!selectedItem) return null;

  return (
    <SlideSheet ref={modalRef} heightPercentage={0.88}>
      <TourImplementationAdditionalEditModalContent
        selectedItem={selectedItem}
        allAdditionalData={allAdditionalData}
        isLoading={isLoading}
        onCloseRequest={handleClose}
        onConfirm={(data) => onConfirm?.(data, handleClose)}
      />
    </SlideSheet>
  );
}
