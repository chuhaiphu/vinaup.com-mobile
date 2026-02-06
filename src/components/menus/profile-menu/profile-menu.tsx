import React, { useContext } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS, HEADER_HEIGHT } from '@/constants/style-constant';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '@/providers/auth-provider';
import { OrganizationContext } from '@/providers/organization-provider';
import { usePathname, useRouter } from 'expo-router';
import { OwnerModeContext } from '@/providers/owner-mode-provider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar } from '@/components/primitives/avatar';

interface ProfileMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ProfileMenu = ({ isVisible, onClose }: ProfileMenuProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const { currentUser } = useContext(AuthContext);
  const { organizations } = useContext(OrganizationContext);
  const { ownerMode, setOwnerMode } = useContext(OwnerModeContext);

  const insets = useSafeAreaInsets();

  // Determine current owner from pathname
  const getCurrentOwner = () => {
    if (!currentUser) return null;
    const isPersonal = pathname.startsWith('/personal');
    const isOrganization = pathname.startsWith('/organization');
    if (isPersonal) {
      return {
        type: 'USER',
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
      };
    }
    if (isOrganization) {
      return {
        type: 'ORGANIZATION',
        id: organizations[0].id,
        name: organizations[0].name,
        avatarUrl: organizations[0].avatarUrl,
      };
    }
    return null;
  };

  const isSelectedOwner = (targetId: string) => {
    return getCurrentOwner()?.id === targetId;
  };

  const sortedOwners = () => {
    if (!currentUser) return [];

    // If the current owner is personal(main user), place user on top of the list
    if (ownerMode === 'personal') {
      return [currentUser, ...organizations];
    }
    // If the current owner is organization, place organization on top of the list
    if (ownerMode === 'organization') {
      return [organizations[0], currentUser];
    }
    return [];
  };

  const handleSelectOwner = (
    ownerType: 'personal' | 'organization',
    ownerId: string
  ) => {
    setOwnerMode(ownerType);
    onClose();
    router.replace(`/${ownerType}`);
  };
  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        {/* Overlay acts as a transparent background that covers the entire screen */
        /* Prevent user from accidentally interacting with the button outside the menu */
        /* Helps to close the menu when the user taps outside */}
        <View
          style={[styles.overlay, { paddingTop: insets.top + HEADER_HEIGHT + 2 }]}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderText}>Profiles</Text>
            </View>
            {sortedOwners().map((owner) => {
              const isMainUser = owner.id === currentUser?.id;
              const isSelected = isSelectedOwner(owner.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    isSelectedOwner(owner.id) && styles.selectedMenuItem,
                  ]}
                  key={owner.id}
                  onPress={() =>
                    handleSelectOwner(
                      isMainUser ? 'personal' : 'organization',
                      owner.id
                    )
                  }
                >
                  <View style={styles.left}>
                    <Avatar
                      imgSrc={owner.avatarUrl}
                      size={32}
                      icon={
                        isMainUser ? undefined : (
                          <MaterialIcons
                            name="groups"
                            size={24}
                            color={COLORS.vinaupTeal}
                          />
                        )
                      }
                    />
                    <Text style={styles.menuText}>{owner.name}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-done-sharp"
                      size={20}
                      color={COLORS.vinaupYellow}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  menuContainer: {
    width: 'auto',
    backgroundColor: COLORS.vinaupSoftGray,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.vinaupYellow,
  },
  menuHeader: {
    padding: 8,
  },
  menuHeaderText: {
    fontSize: 19,
    color: COLORS.vinaupTeal,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    gap: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedMenuItem: {
    backgroundColor: COLORS.vinaupSoftGreen,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 4,
  },
});
