import { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import {
  deleteInvoiceApi,
  getInvoiceByIdApi,
  updateInvoiceApi,
} from '@/apis/invoice-apis';
import {
  InvoiceResponse,
  UpdateInvoiceRequest,
} from '@/interfaces/invoice-interfaces';
import { useRouter } from 'expo-router';
import { useNavigationStore } from '@/hooks/use-navigation-store';

interface InvoiceDetailContextType {
  invoiceId: string;
  invoice: InvoiceResponse | undefined;
  isLoadingInvoice: boolean;
  isRefreshingInvoice: boolean;
  isUpdatingInvoice: boolean;
  isDeletingInvoice: boolean;
  handleUpdateInvoice: (
    fields: UpdateInvoiceRequest,
    onSuccess?: () => void
  ) => void;
  handleDelete: () => void;
  refreshInvoice: () => void;
}

const InvoiceDetailContext = createContext<InvoiceDetailContextType | null>(null);

export function useInvoiceDetailContext() {
  const ctx = useContext(InvoiceDetailContext);
  if (!ctx)
    throw new Error(
      'useInvoiceDetailContext must be used within InvoiceDetailProvider'
    );
  return ctx;
}

export function InvoiceDetailProvider({
  invoiceId,
  children,
}: {
  invoiceId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const {
    data: invoice,
    isLoading: isLoadingInvoice,
    isRefreshing: isRefreshingInvoice,
    executeFetchFn: fetchInvoice,
    refreshFetchFn: refreshInvoice,
  } = useFetchFn(() => getInvoiceByIdApi(invoiceId), {
    fetchKey: `organization-invoice-${invoiceId}`,
    tags: [`organization-invoice-${invoiceId}`],
  });

  const { executeMutationFn: updateInvoice, isMutating: isUpdatingInvoice } =
    useMutationFn(
      (updatedFields: UpdateInvoiceRequest) =>
        updateInvoiceApi(invoiceId, updatedFields),
      { invalidatesTags: ['organization-invoice-list', `organization-invoice-${invoiceId}`] }
    );

  const { executeMutationFn: deleteInvoice, isMutating: isDeletingInvoice } =
    useMutationFn(() => deleteInvoiceApi(invoiceId), {
      invalidatesTags: ['organization-invoice-list'],
    });

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId, fetchInvoice]);

  const handleUpdateInvoice = useCallback(
    (updatedFields: UpdateInvoiceRequest, onSuccessCallback?: () => void) => {
      if (!invoice) return;
      updateInvoice(updatedFields, {
        onSuccess: () => {
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      });
    },
    [invoice, updateInvoice]
  );

  const handleDelete = useCallback(() => {
    if (!invoiceId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          setIsNavigating(true);
          deleteInvoice({
            onSuccess: () => {
              setIsNavigating(false);
              router.back();
            },
            onError: (error: ApiError) => {
              setIsNavigating(false);
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  }, [invoiceId, deleteInvoice, router, setIsNavigating]);

  return (
    <InvoiceDetailContext
      value={{
        invoiceId,
        invoice: invoice ?? undefined,
        isLoadingInvoice,
        isRefreshingInvoice,
        isUpdatingInvoice,
        isDeletingInvoice,
        handleUpdateInvoice,
        handleDelete,
        refreshInvoice,
      }}
    >
      {children}
    </InvoiceDetailContext>
  );
}
