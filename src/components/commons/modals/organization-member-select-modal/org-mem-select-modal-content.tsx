import VinaupDoubleCheck from '@/components/icons/vinaup-double-check.native';
import { Avatar } from '@/components/primitives/avatar';
import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';
import { MemberInChargeTourImplementationResponse } from '@/interfaces/tour-implementation-interfaces';
import { OrganizationMemberResponse } from '@/interfaces/organization-member-interfaces';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MultiSelect } from '@/components/primitives/multi-select';

interface OrgMemSelectModalContentProps {
  isLoading?: boolean;
  organizationMembers?: OrganizationMemberResponse[] | null;
  membersInCharge?: MemberInChargeTourImplementationResponse[] | null;
  onConfirm?: (selectedOrgMemberIds: string[]) => void;
  onClose?: () => void;
}

export function OrgMemSelectModalContent({
  isLoading,
  organizationMembers,
  membersInCharge,
  onConfirm,
  onClose,
}: OrgMemSelectModalContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () =>
      (membersInCharge
        ?.map((m) => m.organizationMemberId)
        .filter((id) => id !== null && id !== undefined) as string[]) ?? []
  );
  const insets = useSafeAreaInsets();

  const protectedMemberIds = new Set(
    membersInCharge
      ?.filter((m) => m.role === 'CREATOR')
      .map((m) => m.organizationMemberId) ?? []
  );

  const filteredMembers = organizationMembers?.filter(
    (member) =>
      !protectedMemberIds.has(member.id) &&
      (member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone?.includes(searchQuery))
  );

  const handleConfirm = () => {
    onConfirm?.(selectedIds);
  };

  const renderOption = (optionValue: string, ctx: { index: number; isSelected: boolean; toggle: () => void }) => {
    const member = organizationMembers?.find((m) => m?.id === optionValue);
    if (!member) return null;
    if (!member.user) return null;
    const isSelected = ctx.isSelected;

    return (
      <Pressable style={styles.memberItem} onPress={ctx.toggle}>
        <Avatar imgSrc={member.avatarUrl} size={40} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberDetail}>
            {member.phone}
            {member.address ? ` - ${member.address}` : ''}
          </Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <VinaupDoubleCheck color={COLORS.vinaupTeal} />}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Text style={styles.title}>Điều hành</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.vinaupTeal} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Nhập tên hoặc số điện thoại..."
          placeholderTextColor={COLORS.vinaupMediumGray}
          style={styles.searchInput}
        />
        {isLoading && <ActivityIndicator size="small" color={COLORS.vinaupTeal} />}
      </View>
      <MultiSelect
        options={filteredMembers?.map((member) => ({
          value: member?.id || '',
          label: member.name,
        })) || []}
        values={selectedIds}
        onChange={setSelectedIds}
        renderOption={renderOption}
      />
      <View style={styles.buttonGroup}>
        <Button style={styles.cancelButton} onPress={onClose} disabled={isLoading}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </Button>
        <Button
          style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={isLoading}
          isLoading={isLoading}
          loaderStyle={{ color: COLORS.vinaupWhite }}
        >
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.vinaupWhite,
    paddingHorizontal: 8,
    paddingTop: 24,
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
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    padding: 10,
    backgroundColor: COLORS.vinaupSoftGray,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.vinaupBlack,
    paddingVertical: 0,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
    marginBottom: 4,
  },
  memberDetail: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: COLORS.vinaupTeal,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
    color: COLORS.vinaupMediumGray,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.vinaupTeal,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupTeal,
  },
  confirmButtonText: {
    fontSize: 16,
    color: COLORS.vinaupWhite,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
