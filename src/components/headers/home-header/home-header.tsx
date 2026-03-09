import { COLORS, HEADER_HEIGHT } from '@/constants/style-constant';
import { Octicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OwnerSelector } from '../../selectors/owner-selector/owner-selector';
import { useLocalSearchParams, usePathname } from 'expo-router';
import NavigatorSelector from '../../selectors/navigator-selector/navigator-selector';
import PersonalReceiptPaymentHeaderBottom from './personal-receipt-payment-header-bottom';
import PersonalProjectHeaderBottom from './personal-project-header-bottom';
import PersonalIndexHeaderBottom from './personal-index-header-bottom';
import OrganizationIndexHeaderBottom from './organization-index-header-bottom';
import InvoiceHeaderBottom from './invoice-header-bottom';

export const HomeHeader = () => {
  const pathname = usePathname();
  const params = useLocalSearchParams<{ organizationId: string }>();

  const renderHeaderBottom = () => {
    switch (true) {
      case pathname.includes('/personal/project'):
        return <PersonalProjectHeaderBottom />;
      case pathname.includes('/personal/receipt-payment'):
        return <PersonalReceiptPaymentHeaderBottom />;
      case pathname === '/personal':
        return <PersonalIndexHeaderBottom />;
      case pathname === `/organization/${params.organizationId}/invoice`:
        return <InvoiceHeaderBottom />;
      case pathname === `/organization/${params.organizationId}`:
        return <OrganizationIndexHeaderBottom />;
      default:
        return null;
    }
  };

  const headerBottom = renderHeaderBottom();

  return (
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
      {headerBottom && <View style={styles.bottomRow}>{headerBottom}</View>}
    </SafeAreaView>
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
    paddingHorizontal: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLeft: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
  },
  titleRight: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
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
