import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useAuthContext } from '@/providers/auth-provider';
import { COLORS } from '@/constants/style-constant';

const PersonalIndexHeaderBottom = () => {
  const { currentUser } = useAuthContext();
  return (
    <>
      <Text style={styles.text}>
        Sở hữu{' '}
        <Text style={styles.count}>{currentUser?.organizationOwnedCount ?? 0}</Text>{' '}
        tổ chức
      </Text>
      <Text style={styles.text}>
        Liên kết{' '}
        <Text style={styles.count}>
          {currentUser?.organizationLinkedCount ?? 0}
        </Text>{' '}
        tổ chức
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
    marginBottom: 6,
  },
  count: {
    fontWeight: '700',
    color: COLORS.vinaupTeal,
  },
});

export default PersonalIndexHeaderBottom;
