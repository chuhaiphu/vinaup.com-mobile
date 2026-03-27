import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useOrganizationContext } from '@/providers/organization-provider';
import { useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/style-constant';

const OrganizationIndexHeaderBottom = () => {
  const { organizationId } = useLocalSearchParams<{ organizationId: string }>();
  const { organizations } = useOrganizationContext();
  const currentOrg = organizations.find((org) => org.id === organizationId);

  return (
    <>
      <Text style={styles.text}>
        Thành viên{' '}
        <Text style={styles.count}>{currentOrg?.memberCount ?? 0}</Text>
      </Text>
      <Text style={styles.text}>
        Liên kết{' '}
        <Text style={styles.count}>{currentOrg?.memberLinkedCount ?? 0}</Text>{' '}
        tài khoản
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: COLORS.vinaupBlack,
  },
  count: {
    fontWeight: '700',
    color: COLORS.vinaupTeal,
  },
});

export default OrganizationIndexHeaderBottom;
