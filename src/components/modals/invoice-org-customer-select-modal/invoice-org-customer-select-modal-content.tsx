import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';
import { Ionicons } from '@expo/vector-icons';

interface InvoiceOrgCustomerSelectModalContentProps {
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

const EXTERNAL_VALUE = 'EXTERNAL';

export function InvoiceOrgCustomerSelectModalContent({
  organizationCustomers,
  currentCustomerId = '',
  isLoading = false,
  onSelectCustomer,
  onCloseRequest,
}: InvoiceOrgCustomerSelectModalContentProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const options = useMemo(() => {
    const base = [
      { value: EXTERNAL_VALUE, label: 'Khách lẻ' },
      ...organizationCustomers.map((c) => ({ value: c.id, label: c.name })),
    ];

    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [organizationCustomers, searchQuery]);

  const handlePick = (value: string) => {
    if (isLoading) return;
    if (value === EXTERNAL_VALUE) {
      onSelectCustomer('external', undefined, onCloseRequest);
    } else {
      onSelectCustomer('organization', value, onCloseRequest);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn khách hàng</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.vinaupTeal} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm khách hàng..."
          placeholderTextColor={COLORS.vinaupMediumGray}
          style={styles.searchInput}
          editable={!isLoading}
        />
        {isLoading && <ActivityIndicator size="small" color={COLORS.vinaupTeal} />}
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {options.map((opt) => {
          const selected = opt.value === currentCustomerId;
          return (
            <Pressable
              key={opt.value}
              style={({ pressed }) => [
                styles.optionRow,
                (pressed || selected) && styles.optionRowActive,
              ]}
              onPress={() => handlePick(opt.value)}
              disabled={isLoading}
            >
              <Text style={styles.optionLabel} numberOfLines={1}>
                {opt.label}
              </Text>
              <View style={styles.trailing}>
                {selected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={COLORS.vinaupTeal}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 28,
    backgroundColor: COLORS.vinaupWhite,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.vinaupBlack,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FBFBFB',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.vinaupBlack,
    paddingVertical: 0,
  },
  listContent: {
    paddingBottom: 20,
  },
  optionRow: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionRowActive: {
    backgroundColor: '#F2FBFA',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: COLORS.vinaupBlack,
  },
  trailing: {
    width: 24,
    alignItems: 'flex-end',
  },
});
