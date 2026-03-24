import VinaupDoubleCheck from '@/components/icons/vinaup-double-check.native';
import { Button } from '@/components/primitives/button';

import { COLORS } from '@/constants/style-constant';
import { OrganizationMemberResponse } from '@/interfaces/organization-member-interfaces';
import { SignatureResponse } from '@/interfaces/signature-interfaces';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SignerSelectModalContentProps {
  isLoading?: boolean;
  organizationMembers?: OrganizationMemberResponse[] | null;
  receiverSignatures?: SignatureResponse[] | null;
  onConfirm?: (selectedOrganizationMemberIds: string[]) => void;
  onClose?: () => void;
}

export function SignerSelectModalContent({
  isLoading,
  organizationMembers,
  receiverSignatures,
  onConfirm,
  onClose,
}: SignerSelectModalContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganizationMemberUserIds, setSelectedOrganizationMemberUserIds] =
    useState<string[]>(() => {
      if (!receiverSignatures) return [];
      return receiverSignatures
        .map((sig) => sig.targetUserId)
        .filter((id): id is string => !!id);
    });
  const insets = useSafeAreaInsets();
  const filteredMembers = organizationMembers?.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.includes(searchQuery)
  );

  const renderMember = ({ member }: { member: OrganizationMemberResponse }) => {
    if (!member.user) return null;
    const isSelected = selectedOrganizationMemberUserIds.includes(member.user.id);

    return (
      <Pressable
        style={styles.memberItem}
        onPress={() => {
          if (isSelected) {
            setSelectedOrganizationMemberUserIds(
              selectedOrganizationMemberUserIds.filter(
                (id) => id !== member?.user?.id
              )
            );
          } else {
            setSelectedOrganizationMemberUserIds([
              ...selectedOrganizationMemberUserIds,
              member?.user?.id || '',
            ]);
          }
        }}
      >
        <Image
          source={{ uri: member?.avatarUrl || 'https://i.pravatar.cc' }}
          style={styles.avatar}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberDetail}>
            {member.phone} - {member.address}
          </Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <VinaupDoubleCheck color={COLORS.vinaupTeal} />}
        </View>
      </Pressable>
    );
  };

  const handleConfirm = () => {
    onConfirm?.(selectedOrganizationMemberUserIds);
  };

  return (
    <View style={[styles.container, { paddingBlock: insets.bottom }]}>
      <Text style={styles.title}>Chọn người ký tên</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.vinaupTeal} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Nhập tên hoặc số điện thoại..."
          placeholderTextColor={COLORS.vinaupMediumGray}
          style={styles.searchInput}
          // editable={!isLoading}
        />
        {isLoading && <ActivityIndicator size="small" color={COLORS.vinaupTeal} />}
      </View>
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderMember({ member: item })}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>Không tìm thấy thành viên</Text>
          ) : null
        }
      />
      <View style={styles.buttonGroup}>
        <Button
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={onClose}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Huỷ</Text>
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
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.vinaupSoftGray,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.vinaupBlack,
    paddingVertical: 0,
  },
  list: {
    maxHeight: 240,
  },
  listContent: {
    paddingBottom: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.vinaupLightGray,
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
    marginTop: 20,
    color: COLORS.vinaupMediumGray,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
