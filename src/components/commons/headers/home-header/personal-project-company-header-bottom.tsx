import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button } from '@/components/primitives/button';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { COLORS } from '@/constants/style-constant';
import { prefetch, useMutationFn } from 'fetchwire';
import { createProjectApi, getProjectByIdApi } from '@/apis/project/project';
import { generateDateCode } from '@/utils/generator/string-generator/generate-date-code';
import { useRouter } from 'expo-router';
import { useNavigationStore } from '@/hooks/use-navigation-store';

const PersonalProjectCompanyHeaderBottom = () => {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();

  const createProjectFn = () =>
    createProjectApi({
      code: generateDateCode(),
      description: 'Tiền công',
      endDate: new Date().toISOString(),
      startDate: new Date().toISOString(),
    });

  const { executeMutationFn: createProject, isMutating } = useMutationFn(
    createProjectFn,
    { invalidatesTags: ['personal-project-list'] }
  );

  const handleAddNew = async () => {
    await createProject({
      onSuccess: async (data) => {
        setIsNavigating(true);
        try {
          await prefetch(() => getProjectByIdApi(data?.id || ''), {
            fetchKey: `personal-project-${data?.id}`,
          });
        } catch {
          // Fallback to normal navigation if prefetch fails.
        }
        setIsNavigating(false);
        router.push({
          pathname: '/(protected)/project-detail/[projectId]',
          params: { projectId: data?.id || '' },
        });
      },
      onError: (error) =>
        Alert.alert('Lỗi', error.message),
    });
  };

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>Thu chi</Text>
        <Text style={styles.titleRight}> Giai đoạn</Text>
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

export default PersonalProjectCompanyHeaderBottom;
