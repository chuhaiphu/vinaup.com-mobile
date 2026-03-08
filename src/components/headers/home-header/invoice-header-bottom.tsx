import React, { useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Button } from '../../primitives/button';
import VinaupAddNew from '../../icons/vinaup-add-new.native';
import { TextSwitcher } from '../../primitives/text-switcher';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { useMutationFn } from '@/hooks/use-mutation-fn';
import { createInvoiceApi, getInvoiceTypesApi } from '@/apis/invoice-apis';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { InvoiceTypeResponse } from '@/interfaces/invoice-type-interfaces';

const InvoiceHeaderBottom = () => {
  const router = useRouter();
  const params = useGlobalSearchParams<{
    organizationId: string;
    invoiceTypeCode?: string;
  }>();
  const currentCode = params.invoiceTypeCode || 'BUY';

  const { data: invoiceTypes, executeFetchFn: fetchInvoiceTypes } =
    useFetchFn<InvoiceTypeResponse[]>({ tags: ['invoice-types'] });

  useEffect(() => {
    fetchInvoiceTypes(() => getInvoiceTypesApi());
  }, [fetchInvoiceTypes]);

  const { executeMutationFn: createInvoice, isMutating } =
    useMutationFn<InvoiceResponse>({
      invalidatesTags: ['organization-invoice-list'],
    });

  const handleAddNew = async () => {
    const invoiceType = invoiceTypes?.find((t) => t.code === currentCode);
    if (!invoiceType) {
      Alert.alert('Lỗi', 'Không tìm thấy loại hoá đơn');
      return;
    }

    await createInvoice(
      () =>
        createInvoiceApi({
          invoiceTypeId: invoiceType.id,
          description: currentCode === 'BUY' ? 'Bán hàng' : 'Mua hàng',
          endDate: new Date(),
          startDate: new Date(),
          organizationId: params.organizationId,
        }),
      {
        onSuccess: (data) => {
          router.push({
            pathname: '/(protected)/organization/invoice-detail/[invoiceId]',
            params: { invoiceId: data.id },
          });
        },
        onError: (error) =>
          Alert.alert('Lỗi', error.message || 'Không thể tạo hoá đơn mới'),
      }
    );
  };

  const handleToggle = () => {
    router.setParams({
      invoiceTypeCode: currentCode === 'BUY' ? 'SELL' : 'BUY',
    });
  };

  return (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>
          {currentCode === 'BUY' ? 'Thu' : 'Chi'}
        </Text>
        <TextSwitcher
          textPair={['bán hàng', 'mua hàng']}
          currentIndex={currentCode === 'BUY' ? 0 : 1}
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
});

export default InvoiceHeaderBottom;
