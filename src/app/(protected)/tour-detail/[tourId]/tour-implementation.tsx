import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Tabs from '@/components/primitives/tabs';
import { COLORS } from '@/constants/style-constant';
import VinaupHome from '@/components/icons/vinaup-home.native';

export default function TourImplementationScreen() {
  const [currentTab, setCurrentTab] = useState('1');

  const tabs = [
    { value: '1', label: 'Home', isIcon: true },
    { value: '2', label: 'Tab 2' },
    { value: '3', label: 'Tab 3' },
    { value: '4', label: 'Tab 4' },
    { value: '5', label: 'Tab 5' },
  ];

  return (
    <View style={styles.container}>
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
        {tabs.map((item) => (
          <Tabs.Panel key={item.value} value={item.value} currentValue={currentTab}>
            <Text style={styles.text}>Nội dung Panel {item.value}</Text>
          </Tabs.Panel>
        ))}
      </View>
    </View>
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
    padding: 4,
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
});
