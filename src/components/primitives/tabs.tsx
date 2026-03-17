import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { PressableOpacity } from './pressable-opacity';
import { COLORS } from '@/constants/style-constant';

export interface TabsListStyles {
  list?: StyleProp<ViewStyle>;
}

export interface TabsTabStyles {
  tab?: StyleProp<ViewStyle>;
  tabText?: StyleProp<TextStyle>;
  activeTab?: StyleProp<ViewStyle>;
  activeTabText?: StyleProp<TextStyle>;
}

export interface TabsPanelStyles {
  panel?: StyleProp<ViewStyle>;
}

interface TabsListProps {
  children: ReactNode;
  styles?: TabsListStyles;
  gap?: number;
}

interface TabProps {
  value: string;
  currentValue?: string;
  onPress?: (value: string) => void;
  children: ReactNode;
  styles?: TabsTabStyles;
}

interface PanelProps {
  value: string;
  currentValue?: string;
  children: ReactNode;
  styles?: TabsPanelStyles;
}

const List = ({ children, styles, gap }: TabsListProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={[defaultStyles.list, styles?.list, { gap }]}
    >
      {children}
    </ScrollView>
  );
};

const Tab = ({ value, children, styles, currentValue, onPress }: TabProps) => {
  const isActive = currentValue === value;

  return (
    <PressableOpacity
      onPress={() => onPress?.(value)}
      activeOpacity={0.7}
      style={[
        defaultStyles.tab,
        styles?.tab,
        isActive && defaultStyles.activeTab,
        isActive && styles?.activeTab,
      ]}
    >
      <Text
        style={[
          defaultStyles.tabText,
          styles?.tabText,
          isActive && defaultStyles.activeTabText,
          isActive && styles?.activeTabText,
        ]}
      >
        {children}
      </Text>
    </PressableOpacity>
  );
};

const Panel = ({ value, currentValue, children, styles }: PanelProps) => {
  if (currentValue !== value) return null;
  return <View style={[defaultStyles.panel, styles?.panel]}>{children}</View>;
};

const Tabs = ({ children }: { children: ReactNode }) => <>{children}</>;

Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panel = Panel;

export default Tabs;

const defaultStyles = StyleSheet.create({
  list: {},
  tab: {
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: COLORS.vinaupYellow },
  tabText: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
  },
  activeTabText: {
    color: COLORS.vinaupYellow,
    fontWeight: '600',
  },
  panel: {},
});
