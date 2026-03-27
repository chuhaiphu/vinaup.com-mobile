import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Tabs from '@/components/primitives/tabs';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { CreateOrganizationCustomerModal } from '@/components/modals/create-organization-customer-modal/create-organization-customer-modal';
import { createOrganizationCustomerApi } from '@/apis/organization-apis';
import { InvoiceOrgCustomerRealList } from '@/components/modals/invoice-org-customer-select-modal/invoice-org-customer-real-list';
import { InvoiceOrgCustomerInternalList } from '@/components/modals/invoice-org-customer-select-modal/invoice-org-customer-internal-list';
import { COLORS } from '@/constants/style-constant';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/primitives/button';
import { useInvoiceDetailContext } from '@/providers/invoice-detail-provider';
import { useAllOrganizationsContext } from '@/providers/all-organizations-provider';

interface InvoiceOrgCustomerSelectModalContentProps {
  onCloseRequest?: () => void;
}

type TabValue = 'real' | 'internal';

type PendingSelection =
  | { type: 'real'; organizationId: string }
  | { type: 'internal'; customerId: string }
  | null;

export function InvoiceOrgCustomerSelectModalContent({
  onCloseRequest,
}: InvoiceOrgCustomerSelectModalContentProps) {
  const {
    invoice,
    organizationCustomers,
    isUpdatingInvoice,
    handleUpdateInvoice,
    refreshOrganizationCustomers,
  } = useInvoiceDetailContext();
  const { allOrganizations: organizations } = useAllOrganizationsContext();

  const organizationId = invoice?.organization?.id;
  const currentCustomerId = invoice?.organizationCustomer?.id ?? '';
  const isLoading = isUpdatingInvoice;

  const createCustomerModalRef = useRef<SlideSheetRef | null>(null);

  const [currentTab, setCurrentTab] = useState<TabValue>('internal');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingSelection, setPendingSelection] = useState<PendingSelection>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCustomer = (() => {
    return organizationCustomers.find(
      (customer) => customer.id === currentCustomerId
    );
  })();

  const realOrganizationCustomers = (() => {
    const mapping = new Map<string, OrganizationCustomerResponse>();
    organizationCustomers.forEach((customer) => {
      if (customer.clientOrganizationId) {
        mapping.set(customer.clientOrganizationId, customer);
      }
    });
    return mapping;
  })();

  const q = searchQuery.trim().toLowerCase();
  const internalOrganizationCustomers = organizationCustomers.filter(
    (customer) => customer.clientOrganizationId == null
  );
  const filteredInternalOrgCustomers = (() => {
    if (!q) return internalOrganizationCustomers;

    return internalOrganizationCustomers.filter((customer) => {
      const searchableValue = [customer.name, customer.phone, customer.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableValue.includes(q);
    });
  })();

  const realOrganizations = (() => {
    if (!q) return organizations;

    return organizations.filter((organization) => {
      const searchableValue = [
        organization.name,
        organization.phone,
        organization.email,
        organization.province,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableValue.includes(q);
    });
  })();

  const pendingSelectedKey = (() => {
    if (!pendingSelection) return '';
    if (pendingSelection.type === 'real') {
      return `real:${pendingSelection.organizationId}`;
    }
    return `internal:${pendingSelection.customerId}`;
  })();

  const selectedKey = pendingSelectedKey;
  const isBusy = isLoading || isSubmitting;

  useEffect(() => {
    if (currentCustomer) {
      if (currentCustomer.clientOrganizationId) {
        setPendingSelection({
          type: 'real',
          organizationId: currentCustomer.clientOrganizationId,
        });
        setCurrentTab('real');
      } else {
        setPendingSelection({ type: 'internal', customerId: currentCustomer.id });
        setCurrentTab('internal');
      }
    } else {
      setPendingSelection(null);
    }
  }, [currentCustomer, currentCustomer?.clientOrganizationId]);

  const handleChooseInternal = (customerId: string) => {
    const key = `internal:${customerId}`;
    if (selectedKey === key) {
      setPendingSelection(null);
      return;
    }

    setPendingSelection({ type: 'internal', customerId });
  };

  const handleChooseReal = (organizationIdValue: string) => {
    const key = `real:${organizationIdValue}`;
    const unlinkKey = `unlink:${organizationIdValue}`;

    if (pendingSelectedKey === key || pendingSelectedKey === unlinkKey) {
      setPendingSelection(null);
      return;
    }

    setPendingSelection({
      type: 'real',
      organizationId: organizationIdValue,
    });
  };

  const handleConfirm = async () => {
    if (pendingSelection?.type === 'internal') {
      handleUpdateInvoice(
        { organizationCustomerId: pendingSelection.customerId },
        () => {
          onCloseRequest?.();
        }
      );
      return;
    }

    const selectedOrganization = organizations.find(
      (organization) => organization.id === pendingSelection?.organizationId
    );

    if (!selectedOrganization) {
      return;
    }

    const selectingOrganizationCustomer = realOrganizationCustomers.get(
      selectedOrganization.id
    );

    if (selectingOrganizationCustomer) {
      handleUpdateInvoice(
        { organizationCustomerId: selectingOrganizationCustomer.id },
        () => {
          onCloseRequest?.();
        }
      );
      return;
    }

    if (!organizationId) {
      return;
    }

    setIsSubmitting(true);
    try {
      const createdResponse = await createOrganizationCustomerApi({
        organizationId,
        name: selectedOrganization.name,
        phone: selectedOrganization.phone,
        email: selectedOrganization.email || undefined,
        status: 'ACTIVE',
        joinedAt: new Date(),
        clientOrganizationId: selectedOrganization.id,
      });
      const createdCustomer = createdResponse.data;
      if (!createdCustomer) {
        throw new Error('Không thể tạo liên kết tổ chức cộng đồng.');
      }
      refreshOrganizationCustomers();
      handleUpdateInvoice(
        { organizationCustomerId: createdCustomer.id },
        () => {
          onCloseRequest?.();
        }
      );
      return;
    } catch {
      Alert.alert('Lỗi', 'Không thể liên kết tổ chức cộng đồng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Khách hàng / Đối tác</Text>
        {currentTab === 'internal' ? (
          <Button
            onPress={() => createCustomerModalRef.current?.open()}
            style={styles.actionIconButton}
            disabled={isBusy}
            hitSlop={8}
          >
            <Feather
              name="user-plus"
              size={22}
              color={isBusy ? COLORS.vinaupMediumGray : COLORS.vinaupTeal}
            />
          </Button>
        ) : null}
      </View>

      <Tabs.List
        styles={{
          list: styles.tabList,
        }}
      >
        <Tabs.Tab
          value="real"
          currentValue={currentTab}
          onPress={(value) => setCurrentTab(value as TabValue)}
          styles={{
            tab: styles.tab,
            tabTextContainer: styles.tabTextContainer,
            tabText: styles.tabText,
            activeTabText: styles.activeTabText,
          }}
        >
          Tổ chức cộng đồng
        </Tabs.Tab>
        <Tabs.Tab
          value="internal"
          currentValue={currentTab}
          onPress={(value) => setCurrentTab(value as TabValue)}
          styles={{
            tab: styles.tab,
            tabTextContainer: styles.tabTextContainer,
            tabText: styles.tabText,
            activeTabText: styles.activeTabText,
          }}
        >
          Nội bộ tổ chức
        </Tabs.Tab>
      </Tabs.List>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.vinaupTeal} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tên hoặc số điện thoại"
          placeholderTextColor={COLORS.vinaupMediumGray}
          style={styles.searchInput}
          editable={!isBusy}
        />
        {isBusy ? (
          <ActivityIndicator size="small" color={COLORS.vinaupTeal} />
        ) : null}
      </View>

      {currentTab === 'real' ? (
        <InvoiceOrgCustomerRealList
          realOrganizations={realOrganizations}
          selectedKey={selectedKey}
          isBusy={isBusy}
          onChooseReal={handleChooseReal}
        />
      ) : (
        <InvoiceOrgCustomerInternalList
          customers={filteredInternalOrgCustomers}
          selectedKey={selectedKey}
          isBusy={isBusy}
          onChooseInternal={handleChooseInternal}
        />
      )}

      <Text style={styles.helperText}>
        *Kho dữ liệu của bạn để tái sử dụng khi cần
      </Text>

      <View style={styles.footerActions}>
        <Button
          style={styles.cancelButton}
          onPress={onCloseRequest}
          disabled={isBusy}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </Button>
        <Button
          loaderStyle={{
            color: COLORS.vinaupWhite,
          }}
          isLoading={isSubmitting}
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={isBusy || pendingSelection === null}
        >
          <Text style={styles.confirmButtonText}>Chọn</Text>
        </Button>
      </View>

      <CreateOrganizationCustomerModal
        organizationId={organizationId}
        modalRef={createCustomerModalRef}
        onCreated={(created) => {
          refreshOrganizationCustomers();
          setCurrentTab('internal');
          setPendingSelection({
            type: 'internal',
            customerId: created.id,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: COLORS.vinaupWhite,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.vinaupBlack,
  },
  actionIconButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabList: {
    flex: 1,
    backgroundColor: COLORS.vinaupSoftGray,
    borderRadius: 10,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
  },
  tabTextContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.vinaupMediumGray,
  },
  activeTabText: {
    color: COLORS.vinaupTeal,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.vinaupBlack,
    paddingVertical: 0,
  },
  helperText: {
    fontSize: 16,
    color: COLORS.vinaupBlack,
    fontStyle: 'italic',
    marginTop: 4,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.vinaupWhite,
  },
  cancelButtonText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.vinaupTeal,
  },
  confirmButtonText: {
    fontSize: 18,
    color: COLORS.vinaupWhite,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
