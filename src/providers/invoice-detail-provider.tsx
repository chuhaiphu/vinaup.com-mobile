import { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import {
  deleteInvoiceApi,
  getInvoiceByIdApi,
  updateInvoiceApi,
} from '@/apis/invoice-apis';
import { getReceiptPaymentsByInvoiceIdApi } from '@/apis/receipt-payment-apis';
import { InvoiceResponse, UpdateInvoiceRequest } from '@/interfaces/invoice-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useSafeRouter } from '@/hooks/use-safe-router';

interface InvoiceDetailContextType {
  invoiceId: string;
  invoice: InvoiceResponse | undefined;
  isLoadingInvoice: boolean;
  isRefreshingInvoice: boolean;
  isUpdatingInvoice: boolean;
  isDeletingInvoice: boolean;
  receiptPayments: ReceiptPaymentResponse[];
  isLoadingReceiptPayments: boolean;
  isRefreshingReceiptPayments: boolean;
  handleUpdateInvoice: (fields: UpdateInvoiceRequest, onSuccess?: () => void) => void;
  handleDelete: () => void;
  refreshInvoice: () => void;
  refreshReceiptPayments: () => void;
}

const InvoiceDetailContext = createContext<InvoiceDetailContextType | null>(null);

export function useInvoiceDetailContext() {
  const ctx = useContext(InvoiceDetailContext);
  if (!ctx) throw new Error('useInvoiceDetailContext must be used within InvoiceDetailProvider');
  return ctx;
}

export function InvoiceDetailProvider({
  invoiceId,
  children,
}: {
  invoiceId: string;
  children: React.ReactNode;
}) {
  const safeRouter = useSafeRouter();

  const {
    data: invoice,
    isLoading: isLoadingInvoice,
    isRefreshing: isRefreshingInvoice,
    executeFetchFn: fetchInvoice,
    refreshFetchFn: refreshInvoice,
  } = useFetchFn(() => getInvoiceByIdApi(invoiceId), {
    tags: [`organization-invoice-${invoiceId}`],
  });

  const { executeMutationFn: updateInvoice, isMutating: isUpdatingInvoice } = useMutationFn(
    (updatedFields: UpdateInvoiceRequest) => updateInvoiceApi(invoiceId, updatedFields),
    { invalidatesTags: ['organization-invoice-list'] }
  );

  const { executeMutationFn: deleteInvoice, isMutating: isDeletingInvoice } =
    useMutationFn(() => deleteInvoiceApi(invoiceId), {
      invalidatesTags: ['organization-invoice-list'],
    });

  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    isRefreshing: isRefreshingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
    refreshFetchFn: refreshReceiptPayments,
  } = useFetchFn(() => getReceiptPaymentsByInvoiceIdApi(invoiceId), {
    tags: ['organization-receipt-payment-list-in-invoice'],
  });

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
      fetchReceiptPayments();
    }
  }, [invoiceId, fetchInvoice, fetchReceiptPayments]);

  const handleUpdateInvoice = useCallback(
    (updatedFields: UpdateInvoiceRequest, onSuccessCallback?: () => void) => {
      if (!invoice) return;
      updateInvoice(updatedFields, {
        onSuccess: () => {
          refreshInvoice();
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      });
    },
    [invoice, updateInvoice, refreshInvoice]
  );

  const handleDelete = useCallback(() => {
    if (!invoiceId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          deleteInvoice({
            onSuccess: () => {
              safeRouter.safeBack();
            },
            onError: (error: ApiError) => {
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  }, [invoiceId, deleteInvoice, safeRouter]);

  return (
    <InvoiceDetailContext
      value={{
        invoiceId,
        invoice: invoice ?? undefined,
        isLoadingInvoice,
        isRefreshingInvoice,
        isUpdatingInvoice,
        isDeletingInvoice,
        receiptPayments: receiptPayments ?? [],
        isLoadingReceiptPayments,
        isRefreshingReceiptPayments,
        handleUpdateInvoice,
        handleDelete,
        refreshInvoice,
        refreshReceiptPayments,
      }}
    >
      {children}
    </InvoiceDetailContext>
  );
}
