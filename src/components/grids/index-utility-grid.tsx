import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { COLORS } from '@/constants/style-constant';

interface UtilityItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface IndexUtilityGridProps {
  items: UtilityItem[];
  onItemPress: (key: string) => void;
}

export const IndexUtilityGrid = ({ items, onItemPress }: IndexUtilityGridProps) => {
  if (items.length === 0) return null;

  return (
    <View style={styles.gridContainer}>
      {items.map((item) => (
        <PressableOpacity
          key={item.key}
          style={styles.gridItem}
          onPress={() => onItemPress(item.key)}
        >
          <View style={styles.iconBox}>{item.icon}</View>
          <Text style={styles.gridText} numberOfLines={2} ellipsizeMode="tail">
            {item.label}
          </Text>
        </PressableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  gridItem: {
    width: '23%',
    backgroundColor: COLORS.vinaupWhite,
    borderRadius: 10,
    padding: 8,
    justifyContent: 'flex-start',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
  },
  iconBox: {
    marginBottom: 8,
  },
  gridText: {
    fontSize: 16,
  },
});
