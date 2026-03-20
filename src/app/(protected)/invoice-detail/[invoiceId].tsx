import { View, StyleSheet, Alert, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { useEffect } from 'react';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import { UpdateInvoiceRequest } from '@/interfaces/invoice-interfaces';
import {
  deleteInvoiceApi,
  getInvoiceByIdApi,
  updateInvoiceApi,
} from '@/apis/invoice-apis';
import { getReceiptPaymentsByInvoiceIdApi } from '@/apis/receipt-payment-apis';
import { getOrganizationCustomersByOrganizationIdApi } from '@/apis/organization-apis';
import { InvoiceDetailHeaderContent } from '@/components/contents/invoice/invoice-detail-header-content';
import { ReceiptPaymentInvoiceListContent } from '@/components/contents/invoice/receipt-payment-invoice-list-content';
import Loader from '@/components/primitives/loader';
import { Select } from '@/components/primitives/select';
import { InvoiceStatus, InvoiceStatusOptions } from '@/constants/invoice-constants';
import { InvoiceDetailFooterContent } from '@/components/contents/invoice/invoice-detail-footer-content';
import { COLORS } from '@/constants/style-constant';
import { useSafeRouter } from '@/hooks/use-safe-router';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';

export default function InvoiceDetailScreen() {
  const safeRouter = useSafeRouter();
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();

  const fetchInvoiceFn = () => getInvoiceByIdApi(invoiceId);
  const {
    data: invoice,
    isLoading: isLoadingInvoice,
    isRefreshing: isRefreshingInvoice,
    executeFetchFn: fetchInvoice,
    refreshFetchFn: refreshInvoice,
  } = useFetchFn(fetchInvoiceFn);

  const updateInvoiceFn = (updatedFields: UpdateInvoiceRequest) =>
    updateInvoiceApi(invoiceId, updatedFields);

  const { executeMutationFn: updateInvoice, isMutating: isUpdatingInvoice } =
    useMutationFn(updateInvoiceFn, {
      invalidatesTags: ['organization-invoice-list'],
    });

  const deleteInvoiceFn = () => deleteInvoiceApi(invoiceId);
  const {
    executeMutationFn: deleteInvoiceMutation,
    isMutating: isDeletingInvoice,
  } = useMutationFn(deleteInvoiceFn, {
    invalidatesTags: ['organization-invoice-list'],
  });

  const fetchReceiptPaymentsFn = () => getReceiptPaymentsByInvoiceIdApi(invoiceId);
  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    isRefreshing: isRefreshingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
    refreshFetchFn: refreshReceiptPayments,
  } = useFetchFn(fetchReceiptPaymentsFn, {
    tags: ['organization-receipt-payment-list-in-invoice'],
  });

  const fetchOrganizationCustomersFn = () =>
    getOrganizationCustomersByOrganizationIdApi(invoice?.organization?.id || '');
  const {
    data: organizationCustomers,
    executeFetchFn: fetchOrganizationCustomers,
  } = useFetchFn(fetchOrganizationCustomersFn);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
      fetchReceiptPayments();
    }
  }, [invoiceId, fetchInvoice, fetchReceiptPayments]);

  useEffect(() => {
    if (invoice?.organization?.id) {
      fetchOrganizationCustomers();
    }
  }, [invoice?.organization?.id, fetchOrganizationCustomers]);

  const handleUpdateInvoice = (
    updatedFields: UpdateInvoiceRequest,
    onSuccessCallback?: () => void
  ) => {
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
  };

  const handleDelete = () => {
    if (!invoiceId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          deleteInvoiceMutation({
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
  };

  const handleSaveAndExit = () => {
    if (!invoice) return;
    refreshInvoice();
    refreshReceiptPayments();
    safeRouter.safeBack();
  };

  if (isLoadingInvoice) {
    return (
      <View>
        <Loader size={64} />
      </View>
    );
  }

  return (
    <>
      <StackWithHeader
        title={'Chi tiết' + ' ' + invoice?.invoiceType.description}
        onDelete={handleDelete}
        onSave={handleSaveAndExit}
        isDeleting={isDeletingInvoice}
      />
      <View style={styles.container}>
        <View style={styles.actionContainer}>
          <View style={styles.statusFilter}>
            <Select
              renderTrigger={(option) => (
                <>
                  <VinaupVerticalExpandArrow width={16} height={16} />
                  <Text style={{ color: COLORS.vinaupTeal }}>
                    {option.label || 'Trạng thái'}
                  </Text>
                </>
              )}
              isLoading={isUpdatingInvoice || isRefreshingInvoice}
              options={InvoiceStatusOptions}
              value={invoice?.status || ''}
              onChange={(value) =>
                handleUpdateInvoice({ status: value as InvoiceStatus })
              }
              placeholder="Trạng thái"
              style={{
                triggerText: {
                  fontSize: 16,
                  color: COLORS.vinaupTeal,
                },
              }}
            />
          </View>
          <View style={styles.actionButton}>
            <PressableOpacity style={styles.actionButtonItem}>
              <Text style={styles.actionButtonItemText}>Hóa đơn</Text>
            </PressableOpacity>
            <PressableOpacity style={styles.actionButtonItem}>
              <FontAwesome5 name="copy" size={18} color={COLORS.vinaupTeal} />
            </PressableOpacity>
            <PressableOpacity style={styles.actionButtonItem}>
              <Entypo
                name="dots-three-horizontal"
                size={18}
                color={COLORS.vinaupTeal}
              />
            </PressableOpacity>
          </View>
        </View>
        <InvoiceDetailHeaderContent
          invoice={invoice ?? undefined}
          isLoading={isUpdatingInvoice || isRefreshingInvoice}
          onConfirm={(data, onSuccessCallback) =>
            handleUpdateInvoice(data, onSuccessCallback)
          }
        />
        {invoice && (
          <ReceiptPaymentInvoiceListContent
            onRefresh={() => {
              refreshInvoice();
              refreshReceiptPayments();
            }}
            receiptPayments={receiptPayments ?? []}
            startDate={invoice.startDate}
            endDate={invoice.endDate}
            loading={isLoadingReceiptPayments}
            refreshing={isRefreshingReceiptPayments}
            invoiceId={invoiceId}
            organizationId={invoice.organization?.id}
            invoiceTypeId={invoice.invoiceType.id}
          />
        )}
        <InvoiceDetailFooterContent
          invoice={invoice ?? undefined}
          organizationCustomers={organizationCustomers ?? []}
          onNoteConfirm={(note, onSuccessCallback) =>
            handleUpdateInvoice({ note }, onSuccessCallback)
          }
          onSelectCustomer={(type, customerId, onSuccessCallback) => {
            if (type === 'external') {
              handleUpdateInvoice(
                {
                  externalCustomerName: 'Khách lẻ',
                  organizationCustomerId: null,
                },
                onSuccessCallback
              );
            } else {
              handleUpdateInvoice(
                {
                  organizationCustomerId: customerId,
                  externalCustomerName: null,
                },
                onSuccessCallback
              );
            }
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
  actionContainer: {
    marginVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonItem: {},
  actionButtonItemText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
