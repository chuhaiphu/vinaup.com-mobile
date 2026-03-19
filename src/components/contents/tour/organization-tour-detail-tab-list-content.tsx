import Tabs from '@/components/primitives/tabs';
import { COLORS } from '@/constants/style-constant';
import { useSafeRouter } from '@/hooks/use-safe-router';
import { StyleSheet } from 'react-native';

interface OrganizationTourDetailTabListContentProps {
  currentTab: string;
  tourId: string;
}

export const OrganizationTourDetailTabListContent = ({
  tourId,
  currentTab,
}: OrganizationTourDetailTabListContentProps) => {
  const safeRouter = useSafeRouter();

  const handleTabChange = (value: string) => {
    safeRouter.safePush(`/(protected)/tour-detail/${tourId}/${value}`);
  };

  const tabItems = [
    { value: 'tour-calculation', label: 'Tính giá' },
    { value: 'tour-implementation', label: 'Thực hiện tour' },
    { value: 'tour-settlement', label: 'Quyết toán' },
  ];

  return (
    <Tabs.List
      styles={{
        list: styles.tabList,
      }}
    >
      {tabItems.map((item) => (
        <Tabs.Tab
          key={item.value}
          value={item.value}
          currentValue={currentTab}
          onPress={handleTabChange}
          styles={{
            tab: styles.tab,
            tabTextContainer: styles.tabTextContainer,
            tabText: styles.tabText,
            activeTabText: styles.activeTabText,
            indicator: styles.indicator,
          }}
        >
          {item.label}
        </Tabs.Tab>
      ))}
    </Tabs.List>
  );
};

const styles = StyleSheet.create({
  tabList: {
    marginHorizontal: 8,
    flex: 1,
    backgroundColor: COLORS.vinaupSoftGray,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
  },
  tabTextContainer: {
    paddingVertical: 10,
  },
  indicator: {
    backgroundColor: COLORS.vinaupYellow,
    height: 2,
    bottom: 0,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.vinaupMediumGray,
  },
  activeTabText: {
    color: COLORS.vinaupTeal,
    fontWeight: '600',
  },
});
