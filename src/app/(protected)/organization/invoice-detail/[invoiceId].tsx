import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { useEffect } from 'react';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import {
  InvoiceResponse,
  UpdateInvoiceRequest,
} from '@/interfaces/invoice-interfaces';
import {
  deleteInvoiceApi,
  getInvoiceByIdApi,
  updateInvoiceApi,
} from '@/apis/invoice-apis';
import { getReceiptPaymentsByInvoiceIdApi } from '@/apis/receipt-payment-apis';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { InvoiceHeaderCard } from '@/components/cards/invoice-header-card';
import { ReceiptPaymentInvoiceList } from '@/components/cards/receipt-payment-invoice-list';
import Loader from '@/components/primitives/loader';
import { useMutationFn } from '@/hooks/use-mutation-fn';
import { Select } from '@/components/primitives/select';
import { InvoiceStatus, InvoiceStatusOptions } from '@/constants/invoice-constants';
import { InvoiceFooterCard } from '@/components/cards/invoice-footer-card';
import { COLORS } from '@/constants/style-constant';

export default function InvoiceDetailScreen() {
  const router = useRouter();
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();

  const {
    data: invoice,
    isLoading,
    executeFetchFn: fetchInvoice,
    refreshFetchFn: refreshInvoice,
  } = useFetchFn<InvoiceResponse>({});

  const { executeMutationFn: updateInvoice, isMutating: isUpdatingInvoice } =
    useMutationFn<InvoiceResponse>({
      invalidatesTags: ['organization-invoice-list'],
    });
  const {
    executeMutationFn: deleteInvoiceMutation,
    isMutating: isDeletingInvoice,
  } = useMutationFn<null>({
    invalidatesTags: ['organization-invoice-list'],
  });

  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
    refreshFetchFn: refreshReceiptPayments,
  } = useFetchFn<ReceiptPaymentResponse[]>({
    tags: ['organization-receipt-payment-list-in-invoice'],
  });

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice(() => getInvoiceByIdApi(invoiceId));
      fetchReceiptPayments(() => getReceiptPaymentsByInvoiceIdApi(invoiceId));
    }
  }, [invoiceId, fetchInvoice, fetchReceiptPayments]);

  const handleUpdateInvoice = (
    updatedFields: UpdateInvoiceRequest,
    onSuccessCallback?: () => void
  ) => {
    if (!invoice) return;
    updateInvoice(() => updateInvoiceApi(invoiceId, updatedFields), {
      onSuccess: () => {
        refreshInvoice();
        onSuccessCallback?.();
      },
      onError: (error) => {
        Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
      },
    });
  };

  const handleDelete = () => {
    if (!invoiceId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          deleteInvoiceMutation(() => deleteInvoiceApi(invoiceId), {
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

  if (isLoading) {
    return (
      <View>
        <Loader size={64} />
      </View>
    );
  }

  return (
    <>
      <StackWithHeader
        title="Chi tiết hoá đơn"
        backTitle="Quay lại"
        onDelete={handleDelete}
        isDeleting={isDeletingInvoice}
      />
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <View style={styles.statusFilter}>
            <Select
              isLoading={isUpdatingInvoice}
              options={InvoiceStatusOptions}
              value={invoice?.status || ''}
              onChange={(value) =>
                handleUpdateInvoice({ status: value as InvoiceStatus })
              }
              placeholder="Trạng thái"
              style={{
                triggerText: {
                  fontSize: 16,
                  color: COLORS.vinaupBlack,
                },
              }}
            />
          </View>
        </View>
        <InvoiceHeaderCard
          invoice={invoice ?? undefined}
          isLoading={isUpdatingInvoice}
          onConfirm={(data, onSuccessCallback) =>
            handleUpdateInvoice(data, onSuccessCallback)
          }
        />
        {invoice && (
          <ReceiptPaymentInvoiceList
            onRefresh={() => {
              refreshInvoice();
              refreshReceiptPayments();
            }}
            receiptPayments={receiptPayments ?? []}
            startDate={invoice.startDate}
            endDate={invoice.endDate}
            loading={isLoadingReceiptPayments}
            invoiceId={invoiceId}
            organizationId={invoice.organization?.id}
          />
        )}
        <InvoiceFooterCard
          invoice={invoice ?? undefined}
          onNoteConfirm={(note, onSuccessCallback) =>
            handleUpdateInvoice({ note }, onSuccessCallback)
          }
          onOrgCusConfirm={(orgName, cusName, onSuccessCallback) => {
            handleUpdateInvoice(
              {
                externalOrganizationName: orgName,
                externalCustomerName: cusName,
              },
              onSuccessCallback
            );
          }}
          isLoading={isUpdatingInvoice}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    marginVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
