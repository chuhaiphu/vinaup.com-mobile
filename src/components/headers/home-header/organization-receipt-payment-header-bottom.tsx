import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Button } from '../../primitives/button';
import VinaupAddNew from '../../icons/vinaup-add-new.native';
import { TextSwitcher } from '../../primitives/text-switcher';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '@/constants/style-constant';
import { ReceiptPaymentType } from '@/constants/receipt-payment-constants';

const OrganizationReceiptPaymentHeaderBottom = () => {
  const router = useRouter();
  const { organizationId, receiptPaymentType } = useGlobalSearchParams<{
    organizationId: string;
    receiptPaymentType?: ReceiptPaymentType;
  }>();
  const currentReceiptPaymentType = receiptPaymentType || 'RECEIPT';

  const handleToggle = () => {
    router.setParams({
      receiptPaymentType: currentReceiptPaymentType === 'RECEIPT' ? 'PAYMENT' : 'RECEIPT',
    });
  };

  const handleAddNew = () => {
    router.push({
      pathname: '/(protected)/personal/receipt-payment-form/[receiptPaymentId]',
      params: {
        receiptPaymentId: 'new',
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType: currentReceiptPaymentType,
        organizationId,
      },
    });
  };

  return (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>
          {currentReceiptPaymentType === 'RECEIPT' ? 'Thu' : 'Chi'}
        </Text>
        <TextSwitcher
          textPair={['bán hàng', 'mua hàng']}
          currentIndex={currentReceiptPaymentType === 'RECEIPT' ? 0 : 1}
          onToggle={handleToggle}
          rightSection={
            <FontAwesome6 name="caret-down" size={20} color={COLORS.vinaupTeal} />
          }
        />
      </View>
      <Button onPress={handleAddNew}>
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

export default OrganizationReceiptPaymentHeaderBottom;
