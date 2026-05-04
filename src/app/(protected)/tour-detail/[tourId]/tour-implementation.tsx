import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tabs from '@/components/primitives/tabs';
import { COLORS } from '@/constants/style-constant';
import VinaupHome from '@/components/icons/vinaup-home.native';
import { useTourDetailContext } from '@/providers/tour-detail-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { TourImplementationHomeTabPanelContent } from '@/components/organization/tour/implementation/tour-implementation-home-tab-panel-content';
import { ReceiptPaymentTourImplementationDirectorListContent } from '@/components/organization/tour/implementation/receipt-payment-tour-implementation-director-list-content';
import { ReceiptPaymentTourImplementationTourGuideListContent } from '@/components/organization/tour/implementation/receipt-payment-tour-implementation-tour-guide-list-content';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';
import { useFetchFn } from 'fetchwire';
import { getTourImplementationByTourIdApi } from '@/apis/tour-apis';
import { getReceiptPaymentsByTourImplementationIdApi } from '@/apis/receipt-payment-apis';
import TourImplementationAdditionalContent from '@/components/organization/tour/implementation/tour-implementation-additional-content';
import { BookingTourImplementationTabPanelContent } from '@/components/organization/tour/implementation/booking-tour-implementation-tab-panel-content';

export default function TourImplementationScreen() {
  const [currentTab, setCurrentTab] = useState('1');
  const { tour } = useTourDetailContext();
  const { currentUser } = useAuthContext();

  const {
    data: tourImplementation,
    executeFetchFn: fetchTourImplementation,
    refreshFetchFn: refreshTourImplementation,
  } = useFetchFn(() => getTourImplementationByTourIdApi(tour?.id || ''), {
    fetchKey: `tour-implementation-${tour?.id}`,
    tags: [`tour-implementation-${tour?.id}`],
  });

  const {
    data: allReceiptPayments,
    isLoading: isLoadingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
  } = useFetchFn(
    () => getReceiptPaymentsByTourImplementationIdApi(tourImplementation?.id || ''),
    {
      fetchKey: `receipt-payment-list-in-tour-implementation-${tourImplementation?.id}`,
      tags: [`receipt-payment-list-in-tour-implementation-${tourImplementation?.id}`],
    }
  );

  useEffect(() => {
    if (tour?.id) fetchTourImplementation();
  }, [tour?.id, fetchTourImplementation]);

  useEffect(() => {
    if (tourImplementation?.id) {
      fetchReceiptPayments();
    }
  }, [tourImplementation?.id, fetchReceiptPayments]);
  // Split receipt payments by groupCode from the junction table
  const directorReceiptPayments = (allReceiptPayments ?? []).filter((rp) =>
    rp.tourImplementationReceiptPayments?.some(
      (j) =>
        j.tourImplementationId === tourImplementation?.id &&
        j.groupCode === 'FOR_DIRECTOR'
    )
  );
  const tourGuideReceiptPayments = (allReceiptPayments ?? []).filter((rp) =>
    rp.tourImplementationReceiptPayments?.some(
      (j) =>
        j.tourImplementationId === tourImplementation?.id &&
        j.groupCode === 'FOR_TOUR_GUIDE'
    )
  );

  const isMemberInCharge = tourImplementation?.meta?.canEdit ?? false;

  const currentUserInvitedPermissions = (tourImplementation?.additionalData ?? [])
    .flatMap((ad) => ad.usersInvited)
    .filter((u) => u.userId === currentUser?.id)
    .flatMap((u) => u.permissions);

  const canViewTourGuideReceiptPayments =
    isMemberInCharge ||
    currentUserInvitedPermissions.includes('RECEIPT_PAYMENT_FOR_TOUR_GUIDE_READ');

  const canViewBooking =
    isMemberInCharge ||
    currentUserInvitedPermissions.includes('BOOKING_READ');

  const baseTabs: { value: string; label: string; isIcon?: boolean }[] = [
    { value: '1', label: 'Home', isIcon: true },
    { value: '2', label: 'Dự toán ĐH' },
  ];
  if (canViewTourGuideReceiptPayments) {
    baseTabs.push({ value: '3', label: 'Dự toán HDV' });
  }
  if (canViewBooking) {
    baseTabs.push({ value: 'booking', label: 'Booking' });
  }
  const tabs = baseTabs;
  const scrollViewRef = useRef<ScrollView>(null);
  return (
    <OrganizationCustomerProvider organizationId={tour?.organization?.id}>
      <View style={styles.screen}>
        <ScrollView ref={scrollViewRef} style={styles.container}>
          <Tabs.List styles={{ list: styles.tabList }} gap={12}>
            {tabs.map((item) => (
              <Tabs.Tab
                key={item.value}
                value={item.value}
                currentValue={currentTab}
                onPress={setCurrentTab}
                styles={{
                  tab: [styles.tab, currentTab === item.value && styles.activeTab],
                  indicator: { height: 0 },
                }}
              >
                {item.isIcon ? (
                  <VinaupHome
                    width={18}
                    height={18}
                    color={
                      currentTab === item.value
                        ? COLORS.vinaupTeal
                        : COLORS.vinaupMediumGray
                    }
                  />
                ) : (
                  <Text
                    style={[
                      styles.tabText,
                      currentTab === item.value && styles.activeTabText,
                    ]}
                  >
                    {item.label}
                  </Text>
                )}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <View style={styles.content}>
            <Tabs.Panel
              value="1"
              currentValue={currentTab}
              styles={{
                panel: styles.panel,
              }}
            >
              <TourImplementationHomeTabPanelContent tour={tour} />
            </Tabs.Panel>

            <Tabs.Panel
              value="2"
              currentValue={currentTab}
              styles={{ panel: styles.panel }}
            >
              {tour && tourImplementation && (
                <ReceiptPaymentTourImplementationDirectorListContent
                  receiptPayments={directorReceiptPayments}
                  startDate={tour.startDate}
                  endDate={tour.endDate}
                  loading={isLoadingReceiptPayments}
                  tourImplementationId={tourImplementation.id}
                  organizationId={tour.organization?.id}
                />
              )}
            </Tabs.Panel>

            {canViewTourGuideReceiptPayments && (
              <Tabs.Panel
                value="3"
                currentValue={currentTab}
                styles={{ panel: styles.panel }}
              >
                {tour && tourImplementation && (
                  <ReceiptPaymentTourImplementationTourGuideListContent
                    receiptPayments={tourGuideReceiptPayments}
                    startDate={tour.startDate}
                    endDate={tour.endDate}
                    loading={isLoadingReceiptPayments}
                    tourImplementationId={tourImplementation.id}
                    organizationId={tour.organization?.id}
                  />
                )}
              </Tabs.Panel>
            )}

            {canViewBooking && (
              <Tabs.Panel
                value="booking"
                currentValue={currentTab}
                styles={{ panel: styles.panel }}
              >
                {tourImplementation && (
                  <BookingTourImplementationTabPanelContent
                    tourImplementationId={tourImplementation.id}
                    organizationId={tour?.organization?.id ?? ''}
                  />
                )}
              </Tabs.Panel>
            )}
          </View>
        </ScrollView>
        {currentTab === '1' && (
          <View style={styles.additionalContentWrapper}>
            <TourImplementationAdditionalContent
              tourImplementationId={tourImplementation?.id}
              additionalData={tourImplementation?.additionalData}
              onRefreshTourImplementation={refreshTourImplementation}
            />
          </View>
        )}
      </View>
    </OrganizationCustomerProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {},
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabList: {
    backgroundColor: COLORS.vinaupSoftGray,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
  },
  tab: {
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.vinaupWhite,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 6,
  },
  activeTab: {
    backgroundColor: COLORS.vinaupLightYellow,
    borderColor: COLORS.vinaupYellow,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
  },
  activeTabText: {
    color: COLORS.vinaupTeal,
    fontWeight: '600',
  },
  panel: {
    width: '100%',
  },
  additionalContentWrapper: {
    backgroundColor: COLORS.vinaupLightGreen,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
});
