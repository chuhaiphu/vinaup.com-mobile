import Tabs from '@/components/primitives/tabs';
import { COLORS } from '@/constants/style-constant';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

interface OrganizationTourDetailTabListContentProps {
  currentTab: string;
}
export const OrganizationTourDetailTabListContent = ({
  currentTab,
}: OrganizationTourDetailTabListContentProps) => {
  const router = useRouter();
  const { tourId } = useLocalSearchParams<{ tourId: string }>();

  const handleTabChange = (value: string) => {
    router.replace(`/(protected)/tour-detail/${tourId}/${value}`);
  };

  return (
    <Tabs.List
      styles={{
        list: styles.tabList,
      }}
    >
      <Tabs.Tab
        value="tour-calculation"
        currentValue={currentTab}
        onPress={handleTabChange}
        styles={{
          tab: styles.tab,
          tabText: styles.tabText,
          activeTab: styles.activeTab,
          activeTabText: styles.activeTabText,
        }}
      >
        Tính giá
      </Tabs.Tab>
      <Tabs.Tab
        value="tour-implementation"
        currentValue={currentTab}
        onPress={handleTabChange}
        styles={{
          tab: styles.tab,
          tabText: styles.tabText,
          activeTab: styles.activeTab,
          activeTabText: styles.activeTabText,
        }}
      >
        Thực hiện
      </Tabs.Tab>
      <Tabs.Tab
        value="tour-settlement"
        currentValue={currentTab}
        onPress={handleTabChange}
        styles={{
          tab: styles.tab,
          tabText: styles.tabText,
          activeTab: styles.activeTab,
          activeTabText: styles.activeTabText,
        }}
      >
        Quyết toán
      </Tabs.Tab>
    </Tabs.List>
  );
};

const styles = StyleSheet.create({
  tabList: {
    flex: 1,
    backgroundColor: COLORS.vinaupSoftGray,
    marginHorizontal: 8,
    borderRadius: 4,
    justifyContent: 'space-between',
  },
  tab: {
    borderBottomWidth: 2,
    padding: 8,
    paddingVertical: 10,
  },
  activeTab: { borderBottomColor: COLORS.vinaupYellow },
  tabText: {
    fontSize: 16,
    color: COLORS.vinaupMediumGray,
  },
  activeTabText: {
    color: COLORS.vinaupTeal,
    fontWeight: '600',
  },
});
