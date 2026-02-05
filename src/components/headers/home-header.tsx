import { COLORS, HEADER_HEIGHT } from "@/constants/style-constant";
import { AuthContext } from "@/providers/auth-provider";
import { Octicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileMenu } from "../menus/profile-menu/profile-menu";
import { Avatar } from "../primitives/avatar";
import { OwnerModeContext } from "@/providers/owner-mode-provider";

export const HomeHeader = () => {
  const { currentUser } = useContext(AuthContext);
  const { ownerMode } = useContext(OwnerModeContext);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    // SafeAreaView is a component that automatically apply padding to the nested content
    // never set height to the SafeAreaView
    <SafeAreaView edges={['top']}
      style={[ownerMode === 'personal' ?
        { backgroundColor: COLORS.vinaupBlueDark } :
        { backgroundColor: COLORS.vinaupNavyDark }]}
    >
      <View style={[styles.headerContainer, ownerMode === 'organization' && { backgroundColor: COLORS.vinaupNavyDark }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Octicons name="bell" size={24} color={COLORS.vinaupYellow} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.userNameText}>{currentUser?.name}</Text>
          <Pressable
            onPress={() => setMenuVisible(true)}
          >
            <Avatar imgSrc={currentUser?.avatarUrl} size={32} />
          </Pressable>
        </View>
      </View>
      <ProfileMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.vinaupBlueDark,
  },
  headerLeft: {},
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userNameText: {
    color: COLORS.vinaupYellow,
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: COLORS.vinaupWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});