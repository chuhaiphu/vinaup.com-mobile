import { COLORS, HEADER_HEIGHT } from '@/constants/style-constant';
import { Octicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OwnerSelector } from '../selectors/owner-selector/owner-selector';
import NavigatorSelector from '../selectors/navigator-selector/navigator-selector';

export const HomeHeader = () => {
  return (
    <>
      {/* SafeAreaView is a component that automatically apply padding to the nested content 
      Never set height to the SafeAreaView */}
      <SafeAreaView edges={['top']} style={styles.safeAreaView}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <NavigatorSelector />
            <OwnerSelector />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Octicons name="bell" size={18} color={COLORS.vinaupTeal} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: COLORS.vinaupWhite,
    zIndex: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    // elevation is for Android shadow
    elevation: 3,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userNameText: {
    color: COLORS.vinaupBlueDark,
    fontSize: 18,
  },
  headerTitle: {
    color: COLORS.vinaupWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
