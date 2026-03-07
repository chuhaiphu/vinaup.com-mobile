import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../primitives/button';
import VinaupAddNew from '../../icons/vinaup-add-new.native';
import { COLORS } from '@/constants/style-constant';

const PersonalReceiptPaymentSelfHeaderBottom = () => {
  const router = useRouter();

  const handleAddNew = () => {
    router.push({
      pathname: '/(protected)/personal/receipt-payment/[id]/receipt-payment-form',
      params: {
        id: 'new',
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

export default PersonalReceiptPaymentSelfHeaderBottom;
