import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Button } from '../../primitives/button';
import VinaupAddNew from '../../icons/vinaup-add-new.native';
import { TextSwitcher } from '../../primitives/text-switcher';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { useMutationFn } from '@/hooks/use-mutation-fn';
import { createProjectApi } from '@/apis/project-apis';
import { ProjectResponse } from '@/interfaces/project-interfaces';

const PersonalReceiptPaymentProjectHeaderBottom = () => {
  const router = useRouter();
  const params = useGlobalSearchParams<{ type?: 'SELF' | 'COMPANY' }>();
  const { executeMutationFn: createProject, isMutating } =
    useMutationFn<ProjectResponse>({
      invalidatesTags: ['personal-receipt-payment-project'],
    });

  const handleAddNew = async () => {
    await createProject(
      () =>
        createProjectApi({
          description: params.type === 'COMPANY' ? 'Dự án' : 'Tiền công',
          type: params.type === 'COMPANY' ? 'COMPANY' : 'SELF',
          endDate: new Date(),
          startDate: new Date(),
        }),
      {
        onSuccess: (data) => {
          router.push({
            pathname: '/(protected)/personal/project/[id]/project-detail',
            params: { id: data.id },
          });
        },
        onError: (error) =>
          Alert.alert('Lỗi', error.message || 'Không thể tạo dự án mới'),
      }
    );
  };

  const handleToggle = () => {
    router.setParams({ type: params.type === 'SELF' ? 'COMPANY' : 'SELF' });
  };

  return (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>Thu chi</Text>
        <TextSwitcher
          textPair={['Tiền công', 'Dự án']}
          currentIndex={params.type === 'COMPANY' ? 1 : 0}
          onToggle={handleToggle}
          rightSection={
            <FontAwesome6 name="caret-down" size={20} color={COLORS.vinaupTeal} />
          }
        />
      </View>
      <Button
        onPress={handleAddNew}
        isLoading={isMutating}
        loaderStyle={{ size: 32 }}
      >
        <VinaupAddNew width={30} height={30} />
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
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

export default PersonalReceiptPaymentProjectHeaderBottom;
