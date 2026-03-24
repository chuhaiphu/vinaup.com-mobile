import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VinaupSigningPen from '@/components/icons/vinaup-signing-pen.native';
import VinaupLock from '@/components/icons/vinaup-lock.native';
import VinaupUnlock from '@/components/icons/vinaup-unlock.native';
import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';

interface Props {
  isSigned?: boolean;
  signatureTargetUserId?: string | null;
  currentUserId?: string | null;
  role?: 'SENDER' | 'RECEIVER';
  isLoading?: boolean;
  unsignedText?: string;
  signedText?: string;
  alignment?: 'left' | 'right';
  onSign?: () => void;
}

export default function SignatureEntityContent({
  isSigned = false,
  signatureTargetUserId,
  currentUserId,
  role = 'SENDER',
  isLoading = false,
  unsignedText = 'Chờ ký',
  signedText = 'Đã ký',
  alignment = 'left',
  onSign,
}: Props) {
  const isOwner =
    !!signatureTargetUserId &&
    !!currentUserId &&
    signatureTargetUserId === currentUserId;

  const ActionBlock =
    !isOwner || isSigned ? (
      <VinaupSigningPen color={COLORS.vinaupMediumGray} />
    ) : (
      <Button onPress={onSign} disabled={isLoading} style={styles.actionTouch}>
        <VinaupSigningPen color={COLORS.vinaupTeal} />
      </Button>
    );
  const LockBlock = isSigned ? <VinaupLock /> : <VinaupUnlock />;

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
});
