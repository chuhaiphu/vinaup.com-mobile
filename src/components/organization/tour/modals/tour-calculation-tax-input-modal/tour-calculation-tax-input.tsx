import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import {
  TourCalculationTaxInputModalContent,
  TourCalculationTaxtInputRef,
} from './tour-calculation-tax-input-modal-content';
import { useRef } from 'react';

interface TourCalculationTaxModalProps {
  initialTaxRate?: number;
  isLoading?: boolean;
  modalRef: React.RefObject<SlideSheetRef | null>;
  onConfirm?: (taxRate: number, onSuccess: () => void) => void;
}

export function TourCalculationTaxModal({
  initialTaxRate,
  isLoading,
  modalRef,
  onConfirm,
}: TourCalculationTaxModalProps) {
  const taxInputRef = useRef<TourCalculationTaxtInputRef | null>(null);
  const handleFocus = () => {
    taxInputRef.current?.focus();
  };
  return (
    <SlideSheet ref={modalRef} onOpen={handleFocus}>
      <TourCalculationTaxInputModalContent
        ref={taxInputRef}
        initialTaxRate={initialTaxRate}
        isLoading={isLoading}
        onCloseRequest={() => modalRef.current?.close()}
        onConfirm={(taxRate) => {
          onConfirm?.(taxRate, () => modalRef.current?.close());
        }}
      />
    </SlideSheet>
  );
}
