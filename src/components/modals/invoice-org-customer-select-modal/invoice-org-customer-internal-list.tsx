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
            <View style={styles.trailing}>
              {isSelected ? (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={16} color={COLORS.vinaupTeal} />
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}

      {customers.length === 0 ? (
        <Text style={styles.emptyText}>Không có tổ chức nội bộ phù hợp.</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 12,
  },
  optionRow: {
    borderRadius: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
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
  trailing: {
    width: 42,
    alignItems: 'flex-end',
  },
  checkBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.vinaupWhite,
  },
  emptyText: {
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
  },
});
