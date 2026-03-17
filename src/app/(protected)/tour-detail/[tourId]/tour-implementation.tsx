import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Tabs from '@/components/primitives/tabs';
import { COLORS } from '@/constants/style-constant';
import VinaupHome from '@/components/icons/vinaup-home.native';

export default function TourImplementationScreen() {
  const [currentTab, setCurrentTab] = useState('1');
  return (
    <View style={styles.container}>
      <Tabs.List styles={{ list: styles.tabList }} gap={12}>
        <Tabs.Tab
          styles={{
            tab: styles.tab,
            tabText: styles.tabText,
            activeTab: styles.activeTab,
            activeTabText: styles.activeTabText,
          }}
          value="1"
          currentValue={currentTab}
          onPress={setCurrentTab}
        >
          <VinaupHome
            width={20}
            height={20}
            color={currentTab === '1' ? COLORS.vinaupTeal : COLORS.vinaupMediumGray}
          />
        </Tabs.Tab>
        <Tabs.Tab
          styles={{
            tab: styles.tab,
            tabText: styles.tabText,
            activeTab: styles.activeTab,
            activeTabText: styles.activeTabText,
          }}
          value="2"
          currentValue={currentTab}
          onPress={setCurrentTab}
        >
          Tab 2
        </Tabs.Tab>
        <Tabs.Tab
          styles={{
            tab: styles.tab,
            tabText: styles.tabText,
            activeTab: styles.activeTab,
            activeTabText: styles.activeTabText,
          }}
          value="3"
          currentValue={currentTab}
          onPress={setCurrentTab}
        >
          Tab 3
        </Tabs.Tab>
        <Tabs.Tab
          styles={{
            tab: styles.tab,
            tabText: styles.tabText,
            activeTab: styles.activeTab,
            activeTabText: styles.activeTabText,
          }}
          value="4"
          currentValue={currentTab}
          onPress={setCurrentTab}
        >
          Tab 4
        </Tabs.Tab>
        <Tabs.Tab
          styles={{
            tab: styles.tab,
            tabText: styles.tabText,
            activeTab: styles.activeTab,
            activeTabText: styles.activeTabText,
          }}
          value="5"
          currentValue={currentTab}
          onPress={setCurrentTab}
        >
          Tab 5
        </Tabs.Tab>
      </Tabs.List>

      <View style={styles.content}>
        <Tabs.Panel value="1" currentValue={currentTab}>
          <Text style={styles.text}>Nội dung Panel 1</Text>
        </Tabs.Panel>
        <Tabs.Panel value="2" currentValue={currentTab}>
          <Text style={styles.text}>Nội dung Panel 2</Text>
        </Tabs.Panel>
        <Tabs.Panel value="3" currentValue={currentTab}>
          <Text style={styles.text}>Nội dung Panel 3</Text>
        </Tabs.Panel>
        <Tabs.Panel value="4" currentValue={currentTab}>
          <Text style={styles.text}>Nội dung Panel 4</Text>
        </Tabs.Panel>
        <Tabs.Panel value="5" currentValue={currentTab}>
          <Text style={styles.text}>Nội dung Panel 5</Text>
        </Tabs.Panel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  tabList: {
    borderBottomWidth: 0,
    backgroundColor: COLORS.vinaupSoftGray,
    marginHorizontal: 8,
    borderRadius: 4,
    justifyContent: 'space-between',
  },
  tab: {
    borderBottomWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.vinaupWhite,
    padding: 4,
  },
  activeTab: {
    borderWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: COLORS.vinaupLightYellow,
    borderColor: COLORS.vinaupYellow,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.vinaupMediumGray,
  },
  activeTabText: {
    color: COLORS.vinaupTeal,
    fontWeight: 'normal',
  },
});
