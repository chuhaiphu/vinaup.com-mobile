import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { Select, SelectOption } from '@/components/primitives/select';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';

interface InvoiceOrgCustomerEditModalContentProps {
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

const EXTERNAL_VALUE = 'external';

export function InvoiceOrgCustomerEditModalContent({
  organizationName = '',
  organizationCustomers,
  currentCustomerId = '',
  isLoading = false,
  onSelectCustomer,
  onCloseRequest,
}: InvoiceOrgCustomerEditModalContentProps) {
  const customerOptions: SelectOption[] = [
    { value: EXTERNAL_VALUE, label: 'Khách lẻ' },
    ...organizationCustomers.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];

  const handleSelectCustomer = (value: string) => {
    if (value === EXTERNAL_VALUE) {
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
});

