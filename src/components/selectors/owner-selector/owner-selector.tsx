import React, { useContext } from 'react';
import { AuthContext } from '@/providers/auth-provider';
import { OrganizationContext } from '@/providers/organization-provider';
import { OwnerModeContext } from '@/providers/owner-mode-provider';
import { useLocalSearchParams } from 'expo-router';
import { Avatar } from '@/components/primitives/avatar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS } from '@/constants/style-constant';
import { Select, SelectOption } from '@/components/primitives/select';
import { StyleSheet, Text } from 'react-native';
import VinaupVerticalHalfArrow from '@/components/icons/vinaup-vertical-half-arrow.native';
import { useSafeRouter } from '@/hooks/use-safe-router';

export const OwnerSelector = () => {
  const safeRouter = useSafeRouter();
  const { organizationId: currentOrgId } = useLocalSearchParams<{
    organizationId: string;
  }>();
  const { currentUser } = useContext(AuthContext);
  const { organizations } = useContext(OrganizationContext);
  const { ownerMode, setOwnerMode } = useContext(OwnerModeContext);
  console.log('owner mode', ownerMode, 'current org id', currentOrgId);
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
      safeRouter.safeReplace('/personal');
    } else if (selectedValue.startsWith('organization')) {
      // remove the 'organization-' prefix and join the rest with '-'
      const orgId = selectedValue.split('-').slice(1).join('-');

      setOwnerMode('organization');
      safeRouter.safeReplace(`/organization/${orgId}`);
    }
  };

  return (
    <Select
      isLoading={safeRouter.isNavigating}
      options={profileOptions}
      value={getCurrentValue()}
      onChange={handleValueChange}
      placeholder="Owners"
      renderTrigger={(option) => (
        <>
          <Text style={styles.triggerText} numberOfLines={1}>
            {option.label}
          </Text>
          <VinaupVerticalHalfArrow
            width={14}
            height={14}
            color={COLORS.vinaupTeal}
          />
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  triggerText: {
    color: COLORS.vinaupTeal,
    fontSize: 18,
    fontWeight: '400',
  },
});
