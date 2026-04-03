import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';

interface InvoiceOrgCustomerInternalListProps {
  customers: OrganizationCustomerResponse[];
  selectedKey: string;
  isBusy: boolean;
  onChooseInternal: (customerId: string) => void;
}

export function InvoiceOrgCustomerInternalList({
  customers,
  selectedKey,
  isBusy,
  onChooseInternal,
}: InvoiceOrgCustomerInternalListProps) {
  return (
    <ScrollView contentContainerStyle={styles.listContent}>
      {customers.map((customer) => {
        const key = `internal:${customer.id}`;
        const isSelected = key === selectedKey;

        return (
          <Pressable
            key={customer.id}
            style={({ pressed }) => [
              styles.optionRow,
              (pressed || isSelected) && styles.optionRowActive,
            ]}
            onPress={() => onChooseInternal(customer.id)}
            disabled={isBusy}
          >
            <View style={styles.leadingAvatar}>
              <Ionicons name="person-outline" size={18} color={COLORS.vinaupTeal} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionLabel} numberOfLines={1}>
                {customer.name}
              </Text>
              <Text style={styles.optionSubLabel} numberOfLines={1}>
                {[customer.phone, customer.email].filter(Boolean).join(' - ') ||
                  'Không có thông tin liên hệ'}
              </Text>
            </View>
            <Ionicons
              name={isSelected ? 'radio-button-on-sharp' : 'radio-button-off-sharp'}
              size={24}
              color={isSelected ? COLORS.vinaupTeal : COLORS.vinaupLightGray}
            />
          </Pressable>
        );
      })}

      {customers.length === 0 ? (
        <Text style={styles.emptyText}>Không có tổ chức nội bộ phù hợp.</Text>
      ) : null}
      <Text style={styles.helperText}>
        *Kho dữ liệu của bạn để tái sử dụng khi cần
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 12,
  },
  optionRow: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    minHeight: 60,
  },
  optionRowActive: {
    backgroundColor: '#F2FBFA',
  },
  leadingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 2,
    flexWrap: 'wrap',
  },
  optionLabel: {
    width: '100%',
    fontSize: 16,
    color: COLORS.vinaupTeal,
    fontWeight: '500',
  },
  optionSubLabel: {
    width: '100%',
    fontSize: 14,
    color: COLORS.vinaupBlack,
  },
  emptyText: {
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
  },
  helperText: {
    fontSize: 15,
    color: COLORS.vinaupMediumGray,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
