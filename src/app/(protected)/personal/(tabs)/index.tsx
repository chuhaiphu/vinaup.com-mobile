import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import VinaupUtilityIcon from '@/components/icons/vinaup-utility-icon.native';
import VinaupCog from '@/components/icons/vinaup-cog.native';

export default function PersonalIndexScreen() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const dateLabel = `${day}/${month}`;

  const handlePress = (id: string) => {
    console.log('Pressed:', id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <Pressable
          style={styles.iconButton}
          onPress={() => handlePress('settings')}
        >
          <VinaupCog width={24} height={24} />
        </Pressable>
      </View>

      <View style={styles.utilitiesRow}>
        <View style={styles.utilitiesLeft}>
          <VinaupUtilityIcon width={22} height={22} />
          <Text style={styles.utilitiesText}>Tiện ích</Text>
        </View>
        <Pressable
          style={styles.iconButton}
          onPress={() => handlePress('edit-utilities')}
        >
          <Feather name="edit" size={24} color={COLORS.vinaupTeal} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Pressable
          style={[styles.cardRow, styles.cardRowDivider]}
          onPress={() => handlePress('personal-cashflow')}
        >
          <Text style={styles.cardLabel}>Thu chi cá nhân</Text>
          <Text style={styles.cardValue}>- 25.000.000 đ</Text>
        </Pressable>

        <Pressable
          style={[styles.cardRow, styles.cardRowDivider]}
          onPress={() => handlePress('tour-cashflow')}
        >
          <Text style={styles.cardLabel}>Thu chi tour</Text>
          <Text style={styles.cardValue}>(0)</Text>
        </Pressable>

        <Pressable
          style={styles.cardRow}
          onPress={() => handlePress('tour-schedule')}
        >
          <Text style={styles.cardLabel}>Lịch tour tiến công</Text>
          <Text style={styles.cardValue}>(1)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.vinaupSoftGray,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilitiesRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  utilitiesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  utilitiesText: {
    fontSize: 18,
    fontWeight: '400',
  },
  card: {
    marginTop: 8,
    backgroundColor: COLORS.vinaupWhite,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  cardRow: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupLightGray,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.vinaupTeal,
  },
  cardValue: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
  },
});
