import Tabs from '@/components/primitives/tabs';
import { COLORS } from '@/constants/style-constant';
import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

interface OrganizationTourDetailTabListContentProps {
  currentTab: string;
  tourId: string;
}

export const OrganizationTourDetailTabListContent = ({
  tourId,
  currentTab,
}: OrganizationTourDetailTabListContentProps) => {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.replace(`/(protected)/tour-detail/${tourId}/${value}`);
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
            indicator: styles.indicator,
          }}
        >
          <Text
            style={[
              styles.tabText,
              currentTab === item.value && styles.activeTabText,
            ]}
          >
            {item.label}
          </Text>
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
    paddingHorizontal: 16,
  },
  tabTextContainer: {
    paddingVertical: 10,
  },
  indicator: {
    backgroundColor: COLORS.vinaupYellow,
    height: 2,
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
