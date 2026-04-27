import { Suspense } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StackWithHeader } from '@/components/commons/headers/stack-with-header';
import { InvoiceDetailHeaderContent } from '@/components/organization/invoice/detail/invoice-detail-header-content';
import { ReceiptPaymentInvoiceListContent } from '@/components/organization/invoice/receipt-payment-invoice-list-content';
import { EntityListSectionSkeleton } from '@/components/commons/skeletons/entity-list-section-skeleton';
import Loader from '@/components/primitives/loader';
import { Select } from '@/components/primitives/select';
import { InvoiceStatus, InvoiceStatusOptions } from '@/constants/invoice-constants';
import { InvoiceDetailFooterContent } from '@/components/organization/invoice/detail/invoice-detail-footer-content';
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
    invoiceId,
    handleUpdateInvoice,
    handleDelete,
    refreshInvoice,
  } = useInvoiceDetailContext();

  const handleSaveAndExit = () => {
    if (!invoice) return;
    refreshInvoice();
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
          <Suspense fallback={<EntityListSectionSkeleton />}>
            <ReceiptPaymentInvoiceListContent
              key={`receipt-payment-list-in-invoice-${invoiceId}`}
              onRefresh={refreshInvoice}
              startDate={invoice.startDate}
              endDate={invoice.endDate}
              invoiceId={invoiceId}
              organizationId={invoice.organization?.id}
              invoiceTypeId={invoice.invoiceType.id}
            />
          </Suspense>
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
