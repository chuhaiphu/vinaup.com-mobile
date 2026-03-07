import React, { useContext } from 'react';
import { Text, StyleSheet } from 'react-native';
import { AuthContext } from '@/providers/auth-provider';
import { COLORS } from '@/constants/style-constant';

const PersonalIndexHeaderBottom = () => {
  const { currentUser } = useContext(AuthContext);

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
  },
  count: {
    fontWeight: '700',
    color: COLORS.vinaupTeal,
  },
});

export default PersonalIndexHeaderBottom;
