import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../primitives/button';
import VinaupAddNew from '../../icons/vinaup-add-new.native';
import { COLORS } from '@/constants/style-constant';
import { useSafeRouter } from '@/hooks/use-safe-router';

const PersonalReceiptPaymentHeaderBottom = () => {
  const safeRouter = useSafeRouter();

  const handleAddNew = () => {
    safeRouter.safePush({
      pathname: '/(protected)/receipt-payment-form/[receiptPaymentId]',
      params: {
        receiptPaymentId: 'new',
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType: 'PAYMENT',
      },
    });
  };

  return (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleLeft}>Thu chi</Text>
        <Text style={styles.titleRight}> ngày</Text>
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
  titleRight: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
});

export default PersonalReceiptPaymentHeaderBottom;
