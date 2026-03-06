import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '@/providers/auth-provider';
import { COLORS } from '@/constants/style-constant';

const PersonalIndexHeaderBottom = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Sở hữu{' '}
        <Text style={styles.count}>{currentUser?.organizationOwnedCount ?? 0}</Text>{' '}
        tổ chức
      </Text>
      <Text style={styles.text}>
        Liên kết với{' '}
        <Text style={styles.count}>
          {currentUser?.organizationLinkedCount ?? 0}
        </Text>{' '}
        tổ chức
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 14,
    // equal to 42px to align with the bottom of the header
    minHeight: 42,
  },
  text: {
    fontSize: 16,
    color: COLORS.vinaupBlack,
  },
  count: {
    fontWeight: '700',
    color: COLORS.vinaupTeal,
  },
});

export default PersonalIndexHeaderBottom;
