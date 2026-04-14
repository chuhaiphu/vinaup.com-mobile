import React from 'react';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/style-constant';
import Tabs from '../../primitives/tabs';
import { StyleSheet, Text, View } from 'react-native';
import VinaupLeftArrowSeparator from '@/components/icons/vinaup-left-arrow-separator.native';
import VinaupRightArrowSeparator from '@/components/icons/vinaup-right-arrow-separator.native';

const OrganizationBookingHeaderBottom = () => {
  const router = useRouter();
  const params = useGlobalSearchParams<{
    organizationId: string;
    type: string;
  }>();

  const activeTab = params.type || 'FROM';
  const fromBookingColor =
    activeTab === 'FROM' ? COLORS.vinaupTeal : COLORS.vinaupMediumGray;
  const toBookingColor =
    activeTab === 'TO' ? COLORS.vinaupTeal : COLORS.vinaupMediumGray;

  const handleTabPress = (value: string) => {
    router.setParams({ type: value });
  };

  return (
    <View style={styles.bottomContainer}>
      <Tabs.List styles={{ list: styles.tabList }}>
        <Tabs.Tab
          value="FROM"
          currentValue={activeTab}
          onPress={handleTabPress}
          styles={{
            tab: styles.tab,
            tabTextContainer: styles.tabTextContainer,
          }}
        >
          <View style={styles.tabContent}>
            <Text
              style={[styles.tabText, activeTab === 'FROM' && styles.activeTabText]}
            >
              Booking Gửi
            </Text>
            <VinaupRightArrowSeparator color={fromBookingColor} />
          </View>
        </Tabs.Tab>
        <Tabs.Tab
          value="TO"
          currentValue={activeTab}
          onPress={handleTabPress}
          styles={{
            tab: styles.tab,
            tabTextContainer: styles.tabTextContainer,
          }}
        >
          <View style={styles.tabContent}>
            <VinaupLeftArrowSeparator color={toBookingColor} />
            <Text
              style={[styles.tabText, activeTab === 'TO' && styles.activeTabText]}
            >
              Booking Nhận
            </Text>
          </View>
        </Tabs.Tab>
      </Tabs.List>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: 8,
  },
  tabList: {
    flex: 1,
    backgroundColor: COLORS.vinaupSoftGray,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  tab: {},
  tabTextContainer: {
    paddingVertical: 10,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.vinaupMediumGray,
  },
  activeTabText: {
    color: COLORS.vinaupTeal,
    fontWeight: 'bold',
  },
});

export default OrganizationBookingHeaderBottom;
