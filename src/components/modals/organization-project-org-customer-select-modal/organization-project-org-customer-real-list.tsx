import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { OrganizationResponse } from '@/interfaces/organization-interfaces';

interface OrganizationProjectOrgCustomerRealListProps {
  realOrganizations: OrganizationResponse[];
  selectedKey: string;
  isBusy: boolean;
  onChooseReal: (organizationId: string) => void;
}

export function OrganizationProjectOrgCustomerRealList({
  realOrganizations,
  selectedKey,
  isBusy,
  onChooseReal,
}: OrganizationProjectOrgCustomerRealListProps) {
  return (
    <ScrollView contentContainerStyle={styles.listContent}>
      {realOrganizations.map((organization) => {
        const key = `real:${organization.id}`;
        const isSelected = key === selectedKey;

        return (
          <Pressable
            key={organization.id}
            style={({ pressed }) => [
              styles.optionRow,
              (pressed || isSelected) && styles.optionRowActive,
            ]}
            onPress={() => onChooseReal(organization.id)}
            disabled={isBusy}
          >
            <View style={styles.leadingAvatar}>
              <Ionicons
                name="business-outline"
                size={18}
                color={COLORS.vinaupTeal}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionLabel} numberOfLines={1}>
                {organization.name}
              </Text>
              <Text style={styles.optionSubLabel} numberOfLines={1}>
                {[organization.phone, organization.province]
                  .filter(Boolean)
                  .join(' - ') || 'Không có thông tin liên hệ'}
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

      {realOrganizations.length === 0 ? (
        <Text style={styles.emptyText}>Không có tổ chức phù hợp.</Text>
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
});
