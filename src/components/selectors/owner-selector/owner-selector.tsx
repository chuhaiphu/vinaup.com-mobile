import React, { useContext } from 'react';
import { AuthContext } from '@/providers/auth-provider';
import { OrganizationContext } from '@/providers/organization-provider';
import { OwnerModeContext } from '@/providers/owner-mode-provider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Avatar } from '@/components/primitives/avatar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS } from '@/constants/style-constant';
import { Select, SelectOption } from '@/components/primitives/select';

export const OwnerSelector = () => {
  const router = useRouter();
  const { organizationId: currentOrgId } = useLocalSearchParams<{ organizationId: string }>();
  const { currentUser } = useContext(AuthContext);
  const { organizations } = useContext(OrganizationContext);
  const { ownerMode, setOwnerMode } = useContext(OwnerModeContext);

  const getSortedOwners = () => {
    if (!currentUser) return [];
    // If the current owner is personal(main user), place user on top of the list
    if (ownerMode === 'personal') {
      return [currentUser, ...organizations];
    }

    // If the current owner is organization,
    // place the active organization on top, then the user, then the rest of organizations
    if (ownerMode === 'organization') {
      const activeOrg = organizations.find((org) => org.id === currentOrgId);
      const otherOrgs = organizations.filter((org) => org.id !== activeOrg?.id);
      return [activeOrg, currentUser, ...otherOrgs];
    }
    return [];
  };

  const getCurrentValue = () => {
    if (ownerMode === 'personal') return 'personal';
    return `organization-${currentOrgId}`;
  };

  const profileOptions: SelectOption[] = getSortedOwners().map((owner) => {
    if (!owner) return { label: null, value: null };
    const isMainUser = owner.id === currentUser?.id;

    return {
      label: owner.name,
      value: isMainUser ? 'personal' : `organization-${owner.id}`,
      leftSection: (
        <Avatar
          imgSrc={owner.avatarUrl}
          size={32}
          icon={
            isMainUser ? undefined : (
              <MaterialIcons name="groups" size={24} color={COLORS.vinaupTeal} />
            )
          }
        />
      ),
    };
  });

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === 'personal') {
      setOwnerMode('personal');
      router.replace('/personal');
    } else if (selectedValue.startsWith('organization')) {
      // remove the 'organization-' prefix and join the rest with '-'
      const orgId = selectedValue.split('-').slice(1).join('-');

      setOwnerMode('organization');
      router.replace(`/organization/${orgId}`);
    }
  };

  return (
    <Select
      options={profileOptions}
      value={getCurrentValue()}
      onChange={handleValueChange}
      placeholder="Owners"
    />
  );
};
