import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tabs from '@/components/primitives/tabs';
import { COLORS } from '@/constants/style-constant';
import VinaupHome from '@/components/icons/vinaup-home.native';
import { useTourContext } from '@/providers/tour-provider';
import { TourImplementationHomeTabPanelContent } from '../../../../components/contents/tour/tour-implementation/tour-implementation-home-tab-panel-content';
import { TourImplementationDirectorTabPanelContent } from '../../../../components/contents/tour/tour-implementation/tour-implementation-director-tab-panel-content';
import { TourImplementationTourGuideTabPanelContent } from '../../../../components/contents/tour/tour-implementation/tour-implementation-tour-guide-tab-panel-content';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';

export default function TourImplementationScreen() {
  const [currentTab, setCurrentTab] = useState('1');
  const { tour } = useTourContext();

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
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
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
            <TourImplementationDirectorTabPanelContent tour={tour} />
          </Tabs.Panel>

          <Tabs.Panel
            value="3"
            currentValue={currentTab}
            styles={{ panel: styles.panel }}
          >
            <TourImplementationTourGuideTabPanelContent tour={tour} />
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
    </OrganizationCustomerProvider>
  );
}

const styles = StyleSheet.create({
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
});
