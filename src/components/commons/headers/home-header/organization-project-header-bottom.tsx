import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Button } from '@/components/primitives/button';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { COLORS } from '@/constants/style-constant';
import { prefetch, useMutationFn } from 'fetchwire';
import { createProjectApi, getProjectByIdApi } from '@/apis/project-apis';
import { useNavigationStore } from '@/hooks/use-navigation-store';

const OrganizationProjectHeaderBottom = () => {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();
  const params = useGlobalSearchParams<{
    organizationId: string;
  }>();

  const createProjectFn = () => {
    return createProjectApi({
      description: 'Dự án',
      endDate: new Date().toISOString(),
      startDate: new Date().toISOString(),
      organizationId: params.organizationId,
    });
  };

  const { executeMutationFn: createProject, isMutating } = useMutationFn(
    createProjectFn,
    { invalidatesTags: ['organization-project-list'] }
  );

  const handleAddNew = async () => {
    await createProject({
      onSuccess: async (data) => {
        const projectId = data?.id || '';
        if (!projectId) {
          Alert.alert('Lỗi', 'Không thể tạo dự án mới');
          return;
        }

        setIsNavigating(true);
        try {
          await prefetch(() => getProjectByIdApi(projectId), {
            fetchKey: `organization-project-${projectId}`,
          });
        } catch {
          // Fallback to normal navigation if prefetch fails.
        }
        setIsNavigating(false);

        router.push({
          pathname: '/(protected)/project-detail/[projectId]',
          params: {
            projectId,
            organizationId: params.organizationId,
          },
        });
      },
      onError: (error) =>
        Alert.alert('Lỗi', error.message || 'Không thể tạo dự án mới'),
    });
  };

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>Thu chi</Text>
        <Text style={styles.titleRight}> Dự án tổ chức</Text>
      </View>
      <Button
        onPress={handleAddNew}
        isLoading={isMutating}
        loaderStyle={{ size: 30 }}
      >
        <VinaupAddNew width={30} height={30} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLeft: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
  },
  titleRight: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
});

export default OrganizationProjectHeaderBottom;
