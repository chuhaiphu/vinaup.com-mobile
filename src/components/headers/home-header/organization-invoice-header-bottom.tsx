import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Button } from '../../primitives/button';
import VinaupAddNew from '../../icons/vinaup-add-new.native';
import { TextSwitcher } from '../../primitives/text-switcher';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { useMutationFn } from 'fetchwire';
import { createInvoiceApi } from '@/apis/invoice-apis';
import { useInvoiceTypeContext } from '@/providers/invoice-type-provider';

const OrganizationInvoiceHeaderBottom = () => {
  const router = useRouter();
  const params = useGlobalSearchParams<{
    organizationId: string;
    invoiceTypeCode?: string;
  }>();
  const currentCode = params.invoiceTypeCode || 'BUY';

  const { getInvoiceTypeByCode } = useInvoiceTypeContext();

  const createInvoiceFn = () => {
    const invoiceType = getInvoiceTypeByCode(currentCode || '');
    if (!invoiceType)
      return Promise.reject(new Error('Không tìm thấy loại hoá đơn'));
    return createInvoiceApi({
      invoiceTypeId: invoiceType.id,
      description: currentCode === 'BUY' ? 'Mua hàng' : 'Bán hàng',
      endDate: new Date(),
      startDate: new Date(),
      organizationId: params.organizationId,
    });
  };

  const { executeMutationFn: createInvoice, isMutating } = useMutationFn(
    createInvoiceFn,
    { invalidatesTags: ['organization-invoice-list'] }
  );

  const handleAddNew = async () => {
    const invoiceType = getInvoiceTypeByCode(currentCode || '');
    if (!invoiceType) {
      Alert.alert('Lỗi', 'Không tìm thấy loại hoá đơn');
      return;
    }
    await createInvoice({
      onSuccess: (data) => {
        router.push({
          pathname: '/(protected)/invoice-detail/[invoiceId]',
          params: { invoiceId: data.id },
        });
      },
      onError: (error) =>
        Alert.alert('Lỗi', error.message || 'Không thể tạo hoá đơn mới'),
    });
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
          {currentCode === 'BUY' ? 'Chi' : 'Thu'}
        </Text>
        <TextSwitcher
          textPair={['mua hàng', 'bán hàng']}
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
        loaderStyle={{ size: 30 }}
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

export default OrganizationInvoiceHeaderBottom;
