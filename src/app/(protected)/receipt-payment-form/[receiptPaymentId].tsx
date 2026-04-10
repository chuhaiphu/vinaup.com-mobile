import React, { Suspense, useRef } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ReceiptPaymentFormContent,
  type ReceiptPaymentFormContentRef,
} from '@/components/contents/receipt-payment-form/receipt-payment-form-content';
import { FormInputListSkeleton } from '@/components/skeletons/form-input-list-skeleton';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { ReceiptPaymentType } from '@/constants/receipt-payment-constants';
import { CreateReceiptPaymentRequest } from '@/interfaces/receipt-payment-interfaces';
import {
  createReceiptPaymentApi,
  deleteReceiptPaymentApi,
  updateReceiptPaymentApi,
} from '@/apis/receipt-payment-apis';
import { useMutationFn } from 'fetchwire';
import { useReceiptPaymentFormStore } from '@/hooks/use-receipt-payment-form-store';
import { COLORS } from '@/constants/style-constant';

type ReceiptPaymentFormParams = {
  receiptPaymentId: string;
  groupCode?: 'FOR_DIRECTOR' | 'FOR_TOUR_GUIDE';
  organizationId?: string;
  receiptPaymentType?: ReceiptPaymentType;
  projectId?: string;
  invoiceId?: string;
  bookingId?: string;
  tourCalculationId?: string;
  tourImplementationId?: string;
  tourSettlementId?: string;
  lockDatePicker?: string;
  allowEditCategory?: string;
  transactionDate?: string;
};

export default function ReceiptPaymentFormScreen() {
  const router = useRouter();
  const formContentRef = useRef<ReceiptPaymentFormContentRef>(null);
  const params = useLocalSearchParams<ReceiptPaymentFormParams>();
  const { receiptPaymentId } = params;
  const isUpdateMode = receiptPaymentId !== 'new';
  const validateBeforeSave = useReceiptPaymentFormStore(
    (state) => state.validateBeforeSave
  );

  const formInvalidatesTags = (() => {
    switch (true) {
      case !!params.projectId:
        return [`receipt-payment-list-in-project-${params.projectId}`];
      case !!params.invoiceId:
        return [
          `receipt-payment-list-in-invoice-${params.invoiceId}`,
          'receipt-payment-list-in-invoice',
        ];
      case !!params.bookingId:
        return [`organization-receipt-payment-list-in-booking-${params.bookingId}`];
      case !!params.tourCalculationId:
        return [
          `organization-receipt-payment-list-in-tour-calculation-${params.tourCalculationId}`,
        ];
      case !!params.tourImplementationId:
        if (params.groupCode === 'FOR_DIRECTOR') {
          return [
            `receipt-payment-tour-implementation-director-${params.tourImplementationId}`,
          ];
        }
        if (params.groupCode === 'FOR_TOUR_GUIDE') {
          return [
            `receipt-payment-tour-implementation-tour-guide-${params.tourImplementationId}`,
          ];
        }
        return [
          `receipt-payment-tour-implementation-director-${params.tourImplementationId}`,
          `receipt-payment-tour-implementation-tour-guide-${params.tourImplementationId}`,
        ];
      case !!params.tourSettlementId:
        return [
          `organization-receipt-payment-list-in-tour-settlement-${params.tourSettlementId}`,
        ];
      default:
        return ['personal-receipt-payment-list'];
    }
  })();

  const createOrUpdateReceiptPaymentFn = () => {
    const formState = useReceiptPaymentFormStore.getState();
    const submitData: CreateReceiptPaymentRequest = {
      description: formState.description,
      unitPrice: Number(formState.unitPrice),
      quantity: Number(formState.quantity),
      frequency: Number(formState.frequency),
      type: formState.type,
      vatRate: Number(formState.vatRate),
      transactionType: formState.transactionType,
      note: formState.note,
      transactionDate: formState.transactionDate.toISOString(),
      currency: 'VND',
      categoryId: formState.selectedCategory,
      projectId: params.projectId,
      invoiceId: params.invoiceId,
      bookingId: params.bookingId,
      tourCalculationId: params.tourCalculationId,
      tourImplementationId: params.tourImplementationId,
      tourSettlementId: params.tourSettlementId,
      groupCode: params.groupCode,
      organizationId: params.organizationId,
    };

    if (isUpdateMode) {
      return updateReceiptPaymentApi(receiptPaymentId, submitData);
    }

    return createReceiptPaymentApi(submitData);
  };

  const { executeMutationFn: createOrUpdateReceiptPayment, isMutating: isSaving } =
    useMutationFn(createOrUpdateReceiptPaymentFn, {
      invalidatesTags: formInvalidatesTags,
    });

  const deleteReceiptPaymentFn = () => deleteReceiptPaymentApi(receiptPaymentId);

  const { executeMutationFn: deleteReceiptPayment, isMutating: isDeleting } =
    useMutationFn(deleteReceiptPaymentFn, {
      invalidatesTags: formInvalidatesTags,
    });

  const handleSaveAndExit = () => {
    if (!validateBeforeSave()) {
      return;
    }

    createOrUpdateReceiptPayment({
      onSuccess: () => {
        if (isUpdateMode) {
          formContentRef.current?.refreshDetail();
        }
        router.back();
      },
      onError: (error) => {
        Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi tạo thu/chi.');
      },
    });
  };

  const handleDelete = () => {
    if (!isUpdateMode) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          deleteReceiptPayment({
            onSuccess: () => {
              router.back();
            },
            onError: (error) => {
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screenContainer}
    >
      <StackWithHeader
        title={isUpdateMode ? 'Sửa Thu / Chi' : 'Tạo Thu / Chi'}
        onDelete={isUpdateMode ? handleDelete : undefined}
        isDeleting={isDeleting}
        onSave={handleSaveAndExit}
        isSaving={isSaving}
      />

      <Suspense fallback={<FormInputListSkeleton />}>
        <ReceiptPaymentFormContent ref={formContentRef} />
      </Suspense>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.vinaupLightWhite,
  },
});
