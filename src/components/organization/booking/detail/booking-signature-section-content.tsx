import {
  cancelSignatureApi,
  getSignaturesByDocumentIdApi,
  signSignatureApi,
} from '@/apis/signature-apis';
import { useFetchFn, useMutationFn } from 'fetchwire';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SignatureEntityContent from '@/components/commons/signature/signature-entity-content';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { COLORS } from '@/constants/style-constant';
import { useAuthContext } from '@/providers/auth-provider';
import VinaupExpand from '@/components/icons/vinaup-expand.native';
import { ConfirmModal } from '@/components/commons/modals/confirm-modal/confirm-modal';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { BookingResponse } from '@/interfaces/booking-interfaces';

interface BookingSignatureSectionContentProps {
  bookingData: BookingResponse;
  onOpenSignatureInfoPopover?: () => void;
}

export default function BookingSignatureSectionContent({
  bookingData,
  onOpenSignatureInfoPopover,
}: BookingSignatureSectionContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSignConfirmVisible, setIsSignConfirmVisible] = useState(false);
  const [isCancelConfirmVisible, setIsCancelConfirmVisible] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(
    null
  );

  const { currentUser } = useAuthContext();

  const {
    data: bookingSignatures,
    isLoading,
    executeFetchFn: fetchSignatures,
  } = useFetchFn(() => getSignaturesByDocumentIdApi(bookingData.id), {
    fetchKey: `signature-list-in-booking-${bookingData.id}`,
    tags: [`signature-list-in-booking-${bookingData.id}`],
  });

  useEffect(() => {
    fetchSignatures();
  }, [bookingData.id, fetchSignatures]);

  const signBookingFn = (id: string) => signSignatureApi(id);
  const cancelBookingFn = (id: string) => cancelSignatureApi(id);

  const signInvalidateTags = [
    `signature-list-in-booking-${bookingData.id}`,
    'organization-booking-list',
    `organization-booking-${bookingData.id}`,
    ...(bookingData.tourImplementationId
      ? [
          `organization-booking-list-in-tour-implementation-${bookingData.tourImplementationId}`,
        ]
      : []),
  ];

  const { executeMutationFn: signBooking, isMutating: isSigningBooking } =
    useMutationFn(signBookingFn, {
      invalidatesTags: signInvalidateTags,
    });

  const { executeMutationFn: cancelBooking, isMutating: isCancelingBooking } =
    useMutationFn(cancelBookingFn, {
      invalidatesTags: signInvalidateTags,
    });

  const handleOpenSignConfirmModal = (
    signatureId?: string,
    isAllowToSign: boolean = true
  ) => {
    if (!signatureId || !isAllowToSign) return;
    setSelectedSignatureId(signatureId);
    setIsSignConfirmVisible(true);
  };

  const handleCloseSignConfirmModal = () => {
    setIsSignConfirmVisible(false);
    setSelectedSignatureId(null);
  };

  const handleOpenCancelConfirmModal = (signatureId?: string) => {
    if (!signatureId) return;
    setSelectedSignatureId(signatureId);
    setIsCancelConfirmVisible(true);
  };

  const handleCloseCancelConfirmModal = () => {
    setIsCancelConfirmVisible(false);
    setSelectedSignatureId(null);
  };

  const handleConfirmSign = () => {
    if (!selectedSignatureId) return;
    signBooking(selectedSignatureId, {
      onSuccess: () => {
        handleCloseSignConfirmModal();
      },
      onError: (error) => console.error('Error signing booking:', error),
    });
  };

  const handleConfirmCancel = () => {
    if (!selectedSignatureId) return;
    cancelBooking(selectedSignatureId, {
      onSuccess: () => {
        handleCloseCancelConfirmModal();
      },
      onError: (error) =>
        console.error('Error canceling booking signature:', error),
    });
  };

  const sender = bookingSignatures?.find((s) => s.signatureRole === 'SENDER');
  const receiver = bookingSignatures?.find((s) => s.signatureRole === 'RECEIVER');
  const hasUnsignedSender =
    bookingSignatures?.some((s) => s.signatureRole === 'SENDER' && !s.isSigned) ??
    false;
  const isBookingCompleted = !!receiver?.isSigned;

  const hasOrganizationCustomer = bookingData.organizationCustomer !== null;
  const isMutating = isSigningBooking || isCancelingBooking;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => setIsExpanded((prev) => !prev)} hitSlop={8}>
            <VinaupExpand
              width={16}
              height={16}
              color={isExpanded ? 'gray' : COLORS.vinaupTeal}
            />
          </Pressable>
          <Text style={styles.title}>Ký tên</Text>
          <PressableOpacity onPress={onOpenSignatureInfoPopover} hitSlop={8}>
            <Ionicons
              name="information-circle-sharp"
              size={24}
              color={COLORS.vinaupYellow}
            />
          </PressableOpacity>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.signaturesGroup}>
          <View style={styles.signatureColumnLeft}>
            <Text style={styles.roleText}>Người tạo</Text>
            <SignatureEntityContent
              isSigned={sender?.isSigned}
              isAllowToSign={
                !sender?.isSigned && sender?.targetUserId === currentUser?.id
              }
              isAllowToCancel={
                !isBookingCompleted &&
                !!sender?.isSigned &&
                sender?.signedByUserId === currentUser?.id
              }
              role="SENDER"
              isLoading={isLoading || isMutating}
              alignment="left"
              onSign={() => handleOpenSignConfirmModal(sender?.id, true)}
              onCancel={() => handleOpenCancelConfirmModal(sender?.id)}
            />
            <Text style={styles.nameText}>
              {sender?.signedByUser?.name ?? sender?.targetUser?.name}
            </Text>
            {sender?.isSigned && (
              <Text style={styles.timeText}>
                {dayjs(sender.signedAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            )}
          </View>

          {hasOrganizationCustomer && (
            <View style={styles.signatureColumnRight}>
              <Text style={styles.roleText}>Bên nhận</Text>
              <SignatureEntityContent
                isSigned={receiver?.isSigned}
                isAllowToSign={!receiver?.isSigned && !hasUnsignedSender}
                isAllowToCancel={false}
                role="RECEIVER"
                isLoading={isLoading || isMutating}
                alignment="right"
                onSign={() =>
                  handleOpenSignConfirmModal(receiver?.id, !hasUnsignedSender)
                }
                onCancel={() => handleOpenCancelConfirmModal(receiver?.id)}
              />
              {receiver?.isSigned && (
                <View style={styles.signatureInfo}>
                  <Text style={styles.nameText}>
                    {receiver.signedByUser?.name ?? receiver.signedByName}
                  </Text>
                  <Text style={styles.timeText}>
                    {dayjs(receiver.signedAt).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      <ConfirmModal
        visible={isSignConfirmVisible}
        headerTitle="Xác nhận ký tên"
        confirmText="Xác nhận"
        cancelText="Huỷ"
        isLoading={isSigningBooking}
        onClose={handleCloseSignConfirmModal}
        onConfirm={handleConfirmSign}
      />
      <ConfirmModal
        visible={isCancelConfirmVisible}
        headerTitle="Xác nhận huỷ ký"
        confirmText="Huỷ ký"
        cancelText="Đóng"
        isLoading={isCancelingBooking}
        onClose={handleCloseCancelConfirmModal}
        onConfirm={handleConfirmCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    marginRight: 6,
  },
  signaturesGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureColumnLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  signatureColumnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  roleText: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  nameText: {
    fontSize: 16,
    marginTop: 6,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
    fontStyle: 'italic',
    marginTop: 2,
  },
  signatureInfo: {
    alignItems: 'flex-end',
  },
});
