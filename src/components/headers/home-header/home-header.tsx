import { COLORS, HEADER_HEIGHT } from '@/constants/style-constant';
import { Octicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OwnerSelector } from '../../selectors/owner-selector/owner-selector';
import { useLocalSearchParams, usePathname } from 'expo-router';
import PersonalNavigatorSelector from '../../selectors/navigator-selector/personal-navigator-selector';
import PersonalReceiptPaymentHeaderBottom from './personal-receipt-payment-header-bottom';
import PersonalProjectSelfHeaderBottom from './personal-project-self-header-bottom';
import PersonalProjectCompanyHeaderBottom from './personal-project-company-header-bottom';
// import PersonalIndexHeaderBottom from './personal-index-header-bottom';
// import OrganizationIndexHeaderBottom from './organization-index-header-bottom';
import OrganizationInvoiceHeaderBottom from './organization-invoice-header-bottom';
import OrganizationTourHeaderBottom from './organization-tour-header-bottom';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import OrganizationBookingHeaderBottom from './organization-booking-header-bottom';
import OrganizationProjectHeaderBottom from './organization-project-header-bottom';

export const HomeHeader = () => {
  const pathname = usePathname();
  const params = useLocalSearchParams<{ organizationId: string }>();

  const renderHeaderBottom = () => {
    switch (true) {
      case pathname.includes('/personal/project-self'):
        return <PersonalProjectSelfHeaderBottom />;
      case pathname.includes('/personal/project-company'):
        return <PersonalProjectCompanyHeaderBottom />;
      case pathname.includes('/personal/receipt-payment'):
        return <PersonalReceiptPaymentHeaderBottom />;
      case pathname === '/personal':
        // return <PersonalIndexHeaderBottom />;
        return null;
      case pathname === `/organization/${params.organizationId}/invoice`:
        return <OrganizationInvoiceHeaderBottom />;
      case pathname === `/organization/${params.organizationId}/booking`:
        return <OrganizationBookingHeaderBottom />;
      case pathname === `/organization/${params.organizationId}`:
        // return <OrganizationIndexHeaderBottom />;
        return null;
      case pathname.includes(`/organization/${params.organizationId}/tour`):
        return <OrganizationTourHeaderBottom />;
      case pathname === `/organization/${params.organizationId}/project`:
        return <OrganizationProjectHeaderBottom />;
      default:
        return null;
    }
  };

  const headerBottom = renderHeaderBottom();

  return (
    <SafeAreaView edges={['top']} style={styles.safeAreaView}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <PersonalNavigatorSelector />
          <OwnerSelector />
        </View>
        <View style={styles.headerRight}>
          <PressableOpacity>
            <Octicons name="bell" size={18} color={COLORS.vinaupTeal} />
          </PressableOpacity>
        </View>
      </View>
      {headerBottom && <View style={styles.bottomRow}>{headerBottom}</View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: COLORS.vinaupWhite,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  bottomRow: {
    backgroundColor: COLORS.vinaupSoftGray,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    // padding: 8,
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
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
