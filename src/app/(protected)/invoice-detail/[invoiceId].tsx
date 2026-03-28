import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { InvoiceDetailHeaderContent } from '@/components/contents/invoice/invoice-detail-header-content';
import { ReceiptPaymentInvoiceListContent } from '@/components/contents/invoice/receipt-payment-invoice-list-content';
import Loader from '@/components/primitives/loader';
import { Select } from '@/components/primitives/select';
import { InvoiceStatus, InvoiceStatusOptions } from '@/constants/invoice-constants';
import { InvoiceDetailFooterContent } from '@/components/contents/invoice/invoice-detail-footer-content';
import { COLORS } from '@/constants/style-constant';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import {
  InvoiceDetailProvider,
  useInvoiceDetailContext,
} from '@/providers/invoice-detail-provider';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';

export default function InvoiceDetailScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();

  return (
    <InvoiceDetailProvider invoiceId={invoiceId}>
      <InvoiceDetailScreenContent />
    </InvoiceDetailProvider>
  );
}

function InvoiceDetailScreenContent() {
  const {
    invoice,
    isLoadingInvoice,
    isUpdatingInvoice,
    isRefreshingInvoice,
    isDeletingInvoice,
    receiptPayments,
    isLoadingReceiptPayments,
    isRefreshingReceiptPayments,
    invoiceId,
    handleUpdateInvoice,
    handleDelete,
    refreshInvoice,
    refreshReceiptPayments,
  } = useInvoiceDetailContext();

  const handleSaveAndExit = () => {
    if (!invoice) return;
    refreshInvoice();
    refreshReceiptPayments();
  };

  if (isLoadingInvoice) {
    return (
      <View>
        <Loader size={64} />
      </View>
    );
  }

  return (
    <OrganizationCustomerProvider organizationId={invoice?.organization?.id}>
      <StackWithHeader
        title={
          'Chi tiết' +
          ' ' +
          (invoice?.invoiceType.description ? invoice?.invoiceType.description : '')
        }
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
        <InvoiceDetailHeaderContent />
        {invoice && (
          <ReceiptPaymentInvoiceListContent
            onRefresh={() => {
              refreshInvoice();
              refreshReceiptPayments();
            }}
            receiptPayments={receiptPayments}
            startDate={invoice.startDate}
            endDate={invoice.endDate}
            loading={isLoadingReceiptPayments}
            refreshing={isRefreshingReceiptPayments}
            invoiceId={invoiceId}
            organizationId={invoice.organization?.id}
            invoiceTypeId={invoice.invoiceType.id}
          />
        )}
        <InvoiceDetailFooterContent />
      </View>
    </OrganizationCustomerProvider>
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
