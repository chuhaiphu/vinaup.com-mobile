import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tabs from '@/components/primitives/tabs';
import { COLORS } from '@/constants/style-constant';
import VinaupHome from '@/components/icons/vinaup-home.native';
import { useTourContext } from '@/providers/tour-provider';
import { TourImplementationHomeTabPanelContent } from '../../../../components/contents/tour/tour-implementation/tour-implementation-home-tab-panel-content';
import { ReceiptPaymentTourImplementationDirectorListContent } from '../../../../components/contents/tour/tour-implementation/receipt-payment-tour-implementation-director-list-content';
import { ReceiptPaymentTourImplementationTourGuideListContent } from '../../../../components/contents/tour/tour-implementation/receipt-payment-tour-implementation-tour-guide-list-content';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';
import { useFetchFn } from 'fetchwire';
import { getTourImplementationByTourIdApi } from '@/apis/tour-apis';
import { getReceiptPaymentsByTourImplementationIdApi } from '@/apis/receipt-payment-apis';
import TourImplementationAdditionalContent from '../../../../components/contents/tour/tour-implementation/tour-implementation-additional-content';

export default function TourImplementationScreen() {
  const [currentTab, setCurrentTab] = useState('1');
  const { tour } = useTourContext();

  const {
    data: tourImplementation,
    executeFetchFn: fetchTourImplementation,
    refreshFetchFn: refreshTourImplementation,
  } = useFetchFn(() => getTourImplementationByTourIdApi(tour?.id || ''), {
    tags: [`tour-implementation-${tour?.id}`],
  });

  const {
    data: directorReceiptPayments,
    isLoading: isLoadingDirector,
    executeFetchFn: fetchDirectorReceiptPayments,
  } = useFetchFn(
    () =>
      getReceiptPaymentsByTourImplementationIdApi(
        tourImplementation?.id || '',
        'FOR_DIRECTOR'
      ),
    { tags: ['receipt-payment-tour-implementation-director'] }
  );

  const {
    data: tourGuideReceiptPayments,
    isLoading: isLoadingTourGuide,
    executeFetchFn: fetchTourGuideReceiptPayments,
  } = useFetchFn(
    () =>
      getReceiptPaymentsByTourImplementationIdApi(
        tourImplementation?.id || '',
        'FOR_TOUR_GUIDE'
      ),
    { tags: ['receipt-payment-tour-implementation-tour-guide'] }
  );

  useEffect(() => {
    if (tour?.id) fetchTourImplementation();
  }, [tour?.id, fetchTourImplementation]);

  useEffect(() => {
    if (tourImplementation?.id) {
      fetchDirectorReceiptPayments();
      fetchTourGuideReceiptPayments();
    }
  }, [
    tourImplementation?.id,
    fetchDirectorReceiptPayments,
    fetchTourGuideReceiptPayments,
  ]);

  const tabs = [
    { value: '1', label: 'Home', isIcon: true },
    { value: '2', label: 'Dự toán ĐH' },
    { value: '3', label: 'Dự toán HDV' },
    { value: '4', label: 'Tab 4' },
    { value: '5', label: 'Tab 5' },
  ];
  const scrollViewRef = useRef<ScrollView>(null);
  return (
    <OrganizationCustomerProvider organizationId={tour?.organization?.id}>
      <View style={styles.screen}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
      >
        <Tabs.List styles={{ list: styles.tabList }} gap={12}>
          {tabs.map((item) => (
            <Tabs.Tab
              key={item.value}
              value={item.value}
              currentValue={currentTab}
              onPress={setCurrentTab}
              styles={{
                tab: [styles.tab, currentTab === item.value && styles.activeTab],
                tabText: styles.tabText,
                activeTabText: styles.activeTabText,
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
                item.label
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
                receiptPayments={directorReceiptPayments ?? []}
                startDate={tour.startDate}
                endDate={tour.endDate}
                loading={isLoadingDirector}
                tourImplementationId={tourImplementation.id}
                organizationId={tour.organization?.id}
              />
            )}
          </Tabs.Panel>

          <Tabs.Panel
            value="3"
            currentValue={currentTab}
            styles={{ panel: styles.panel }}
          >
            {tour && tourImplementation && (
              <ReceiptPaymentTourImplementationTourGuideListContent
                receiptPayments={tourGuideReceiptPayments ?? []}
                startDate={tour.startDate}
                endDate={tour.endDate}
                loading={isLoadingTourGuide}
                tourImplementationId={tourImplementation.id}
                organizationId={tour.organization?.id}
              />
            )}
          </Tabs.Panel>

          {tabs.slice(3).map((item) => (
            <Tabs.Panel
              key={item.value}
              value={item.value}
              currentValue={currentTab}
            >
              <Text style={styles.text}>Nội dung Panel {item.value}</Text>
            </Tabs.Panel>
          ))}
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
  text: {
    fontSize: 18,
    color: '#000',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
});
