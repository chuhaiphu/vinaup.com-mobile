import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMutationFn } from 'fetchwire';
import Tabs from '@/components/primitives/tabs';
import { SlideSheet, SlideSheetRef } from '@/components/primitives/slide-sheet';
import { CreateOrganizationCustomerModal } from '@/components/commons/modals/create-organization-customer-modal/create-organization-customer-modal';
import { createOrganizationCustomerApi } from '@/apis/organization-apis';
import { OrgCustomerRealList } from '@/components/commons/org-customer-real-list';
import { TourOrgCustomerInternalList } from './tour-org-customer-internal-list';
import { COLORS } from '@/constants/style-constant';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { OrganizationResponse } from '@/interfaces/organization-interfaces';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/primitives/button';
import { useTourDetailContext } from '@/providers/tour-detail-provider';
import { useAllOrganizationsContext } from '@/providers/all-organizations-provider';
import { useOrganizationCustomerContext } from '@/providers/organization-customer-provider';

interface TourOrgCustomerSelectModalProps {
  modalRef: React.RefObject<SlideSheetRef | null>;
}

type TabValue = 'real' | 'internal';

type PendingSelection =
  | { type: 'real'; organizationId: string }
  | { type: 'internal'; customerId: string }
  | null;

export function TourOrgCustomerSelectModal({
  modalRef,
}: TourOrgCustomerSelectModalProps) {
  const { tour, isUpdatingTour, handleUpdateTour } = useTourDetailContext();
  const { organizationCustomers, refreshOrganizationCustomers } =
    useOrganizationCustomerContext();
  const { allOrganizations } = useAllOrganizationsContext();

  const organizationId = tour?.organization?.id;
  const currentCustomerId = tour?.organizationCustomer?.id ?? '';
  const isLoading = isUpdatingTour;

  const createCustomerModalRef = useRef<SlideSheetRef | null>(null);

  const { executeMutationFn: createOrgCustomer, isMutating: isCreatingCustomer } =
    useMutationFn(
      (org: OrganizationResponse) =>
        createOrganizationCustomerApi({
          organizationId: organizationId!,
          name: org.name,
          phone: org.phone,
          email: org.email || undefined,
          status: 'ACTIVE',
          joinedAt: new Date().toISOString(),
          clientOrganizationId: org.id,
        }),
      { invalidatesTags: ['organization-customer-list'] }
    );

  const [currentTab, setCurrentTab] = useState<TabValue>('internal');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingSelection, setPendingSelection] = useState<PendingSelection>(null);

  const currentCustomer = organizationCustomers.find(
    (customer) => customer.id === currentCustomerId
  );

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
  const filteredInternalOrgCustomers = !q
    ? internalOrganizationCustomers
    : internalOrganizationCustomers.filter((customer) => {
      const searchableValue = [customer.name, customer.phone, customer.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableValue.includes(q);
    });

  const organizations = (() => {
    const organizationsExceptOwner = allOrganizations.filter(
      (org) => org.id !== organizationId
    );
    if (!q) return organizationsExceptOwner;
    return organizationsExceptOwner.filter((organization) => {
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

  const isBusy = isLoading || isCreatingCustomer;

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
    if (pendingSelectedKey === key) {
      setPendingSelection(null);
      return;
    }
    setPendingSelection({ type: 'internal', customerId });
  };

  const handleChooseReal = (organizationIdValue: string) => {
    const key = `real:${organizationIdValue}`;
    if (pendingSelectedKey === key) {
      setPendingSelection(null);
      return;
    }
    setPendingSelection({ type: 'real', organizationId: organizationIdValue });
  };

  const onCloseRequest = () => modalRef.current?.close();

  const handleConfirm = () => {
    if (pendingSelection?.type === 'internal') {
      handleUpdateTour(
        { organizationCustomerId: pendingSelection.customerId },
        onCloseRequest
      );
      return;
    }

    const selectedOrg = organizations.find(
      (o) => o.id === pendingSelection?.organizationId
    );
    if (!selectedOrg || !organizationId) return;

    const existingCustomer = realOrganizationCustomers.get(selectedOrg.id);
    if (existingCustomer) {
      handleUpdateTour(
        { organizationCustomerId: existingCustomer.id },
        onCloseRequest
      );
      return;
    }

    createOrgCustomer(selectedOrg, {
      onSuccess: (created) => {
        refreshOrganizationCustomers();
        if (created) {
          handleUpdateTour({ organizationCustomerId: created.id }, onCloseRequest);
        }
      },
      onError: () => {
        Alert.alert('Lỗi', 'Không thể liên kết tổ chức cộng đồng.');
      },
    });
  };

  return (
    <SlideSheet ref={modalRef} heightPercentage={0.78}>
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

        <Tabs.List styles={{ list: styles.tabList }}>
          <Tabs.Tab
            value="real"
            currentValue={currentTab}
            onPress={(value) => setCurrentTab(value as TabValue)}
            styles={{
              tab: styles.tab,
              tabTextContainer: styles.tabTextContainer,
            }}
          >
            <Text
              style={[
                styles.tabText,
                currentTab === 'real' && styles.activeTabText,
              ]}
            >
              Tổ chức cộng đồng
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            value="internal"
            currentValue={currentTab}
            onPress={(value) => setCurrentTab(value as TabValue)}
            styles={{
              tab: styles.tab,
              tabTextContainer: styles.tabTextContainer,
            }}
          >
            <Text
              style={[
                styles.tabText,
                currentTab === 'internal' && styles.activeTabText,
              ]}
            >
              Nội bộ tổ chức
            </Text>
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
          <OrgCustomerRealList
            organizations={organizations}
            selectedKey={pendingSelectedKey}
            isBusy={isBusy}
            onChooseReal={handleChooseReal}
          />
        ) : (
          <TourOrgCustomerInternalList
            customers={filteredInternalOrgCustomers}
            selectedKey={pendingSelectedKey}
            isBusy={isBusy}
            onChooseInternal={handleChooseInternal}
          />
        )}

        <View style={styles.footerActions}>
          <Button
            style={styles.cancelButton}
            onPress={onCloseRequest}
            disabled={isBusy}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </Button>
          <Button
            loaderStyle={{ color: COLORS.vinaupWhite }}
            isLoading={isBusy}
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
            setPendingSelection({ type: 'internal', customerId: created.id });
          }}
        />
      </View>
    </SlideSheet>
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
});
