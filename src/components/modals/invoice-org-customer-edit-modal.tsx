import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { Select, SelectOption } from '@/components/primitives/select';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { KeyboardSafeAvoidingView } from '../primitives/keyboard-safe-avoiding-view';

interface InvoiceOrgCustomerEditModalProps {
  visible: boolean;
  organizationName?: string;
  organizationCustomers: OrganizationCustomerResponse[];
  currentCustomerId?: string;
  isLoading?: boolean;
  onSelectCustomer: (
    type: 'external' | 'organization',
    customerId?: string,
    onSuccessCallback?: () => void
  ) => void;
  onClose: () => void;
}

const EXTERNAL_VALUE = 'external';

export function InvoiceOrgCustomerEditModal({
  visible,
  organizationName = '',
  organizationCustomers,
  currentCustomerId = '',
  isLoading = false,
  onSelectCustomer,
  onClose,
}: InvoiceOrgCustomerEditModalProps) {
  const customerOptions: SelectOption[] = [
    { value: EXTERNAL_VALUE, label: 'Khách lẻ' },
    ...organizationCustomers.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];

  const handleSelectCustomer = (value: string) => {
    if (value === EXTERNAL_VALUE) {
      onSelectCustomer('external', undefined, onClose);
    } else {
      onSelectCustomer('organization', value, onClose);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}
      animationType="fade"
    >
      <KeyboardSafeAvoidingView style={styles.modalContainer}>
        <Pressable style={styles.modalOverlay} onPress={onClose} />
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
              isLoading={isLoading}
              options={customerOptions}
              value={currentCustomerId}
              onChange={handleSelectCustomer}
              placeholder="Chọn khách hàng"
              heightPercentage={0.5}
            />
          </View>
        </View>
      </KeyboardSafeAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
    zIndex: 1,
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
