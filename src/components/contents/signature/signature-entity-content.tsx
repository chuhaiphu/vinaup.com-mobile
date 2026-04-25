import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VinaupSigningPen from '@/components/icons/vinaup-signing-pen.native';
import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';

interface Props {
  isSigned?: boolean;
  isAllowToSign?: boolean;
  isAllowToCancel?: boolean;
  role?: 'SENDER' | 'RECEIVER';
  isLoading?: boolean;
  unsignedText?: string;
  signedText?: string;
  cancelText?: string;
  alignment?: 'left' | 'right';
  onSign?: () => void;
  onCancel?: () => void;
}

export default function SignatureEntityContent({
  isSigned = false,
  isAllowToSign = false,
  isAllowToCancel = false,
  role = 'SENDER',
  isLoading = false,
  unsignedText = 'Chờ ký',
  signedText = 'Đã ký',
  cancelText = 'Huỷ',
  alignment = 'left',
  onSign,
  onCancel,
}: Props) {
  const ActionBlock = (() => {
    if (isAllowToSign) {
      return (
        <Button onPress={onSign} disabled={isLoading} style={styles.actionTouch}>
          <VinaupSigningPen color={COLORS.vinaupTeal} />
        </Button>
      );
    }

    if (isAllowToCancel) {
      return (
        <Button
          onPress={onCancel}
          disabled={isLoading}
          style={[styles.cancelButton, isLoading && styles.cancelButtonDisabled]}
        >
          <Text style={styles.cancelButtonText}>{cancelText}</Text>
        </Button>
      );
    }

    return <VinaupSigningPen color={COLORS.vinaupMediumGray} />;
  })();
  const TextBlock = (
    <Text style={[styles.text, isSigned && { color: COLORS.vinaupRed }]}>
      {isSigned ? signedText : unsignedText}
    </Text>
  );

  const renderContent = () => {
    if (role === 'SENDER') {
      return (
        <>
          {ActionBlock}
          {TextBlock}
          {/* {LockBlock} */}
        </>
      );
    }
    return (
      <>
        {/* {LockBlock} */}
        {TextBlock}
        {ActionBlock}
      </>
    );
  };

  return (
    <View
      style={[styles.container, alignment === 'right' ? styles.right : styles.left]}
    >
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {},
  right: {
    justifyContent: 'flex-end',
  },
  text: {
    marginHorizontal: 8,
    color: COLORS.vinaupMediumGray,
  },
  actionTouch: {},
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COLORS.vinaupWhite,
  },
  cancelButtonText: {
    color: COLORS.vinaupRed,
    fontSize: 12,
    fontWeight: '500',
  },
  cancelButtonDisabled: {
    opacity: 0.7,
  },
});
