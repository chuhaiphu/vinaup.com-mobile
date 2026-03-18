import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { Select, SelectOption } from '@/components/primitives/select';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { CreateOrganizationCustomerModal } from '@/components/modals/create-organization-customer-modal/create-organization-customer-modal';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';

interface InvoiceOrgCustomerEditModalContentProps {
  organizationId?: string;
  organizationName?: string;
  organizationCustomers: OrganizationCustomerResponse[];
  currentCustomerId?: string;
  isLoading?: boolean;
  onSelectCustomer: (
    type: 'external' | 'organization',
    customerId?: string,
    onSuccessCallback?: () => void
  ) => void;
  onCloseRequest?: () => void;
}

export function InvoiceOrgCustomerEditModalContent({
  organizationId,
  organizationName = '',
  organizationCustomers,
  currentCustomerId = '',
  isLoading = false,
  onSelectCustomer,
  onCloseRequest,
}: InvoiceOrgCustomerEditModalContentProps) {
  const [localCustomers, setLocalCustomers] =
    useState<OrganizationCustomerResponse[]>(organizationCustomers);

  const createSheetRef = useRef<SlideSheetRef | null>(null);

  const customerOptions: SelectOption[] = [
    { value: 'EXTERNAL', label: 'Khách lẻ' },
    ...localCustomers.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];

  const handleSelectCustomer = (value: string) => {
    if (value === 'EXTERNAL') {
      onSelectCustomer('external', undefined, onCloseRequest);
    } else {
      onSelectCustomer('organization', value, onCloseRequest);
    }
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tổ chức</Text>
        <View style={styles.orgNameContainer}>
          <Text style={styles.orgNameText}>{organizationName}</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Khách hàng</Text>
        <Select
          searchable
          isLoading={isLoading}
          options={customerOptions}
          value={currentCustomerId}
          onChange={handleSelectCustomer}
          placeholder="Chọn khách hàng"
          heightPercentage={0.5}
        />
      </View>

      <PressableOpacity
        style={styles.createButton}
        onPress={() => {
          createSheetRef.current?.open();
        }}
      >
        <Text style={styles.createButtonText}>+ Thêm khách hàng mới</Text>
      </PressableOpacity>

      <CreateOrganizationCustomerModal
        organizationId={organizationId}
        modalRef={createSheetRef}
        onCreated={(created) => {
          setLocalCustomers((prev) => [...prev, created]);
          onSelectCustomer('organization', created.id);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupMediumDarkGray,
    marginBottom: 8,
  },
  orgNameContainer: {
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
  },
  orgNameText: {
    fontSize: 16,
    color: COLORS.vinaupBlack,
  },
  createButton: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 14,
    color: COLORS.vinaupTeal,
    fontWeight: '500',
  },
});
