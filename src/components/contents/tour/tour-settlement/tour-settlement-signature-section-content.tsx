import {
  cancelSignatureApi,
  getSignaturesByDocumentIdApi,
  manageReceiverSignaturesApi,
  signSignatureApi,
} from '@/apis/signature-apis';
import { useFetchFn, useMutationFn } from 'fetchwire';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SignatureEntityContent from '../../signature/signature-entity-content';
import { Feather, Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { COLORS } from '@/constants/style-constant';
import { useAuthContext } from '@/providers/auth-provider';
import VinaupExpand from '@/components/icons/vinaup-expand.native';
import { SignerSelectModal } from '@/components/modals/signer-select-modal/signer-select-modal';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { getOrganizationMembersByOrganizationIdApi } from '@/apis/organization-apis';
import { ConfirmModal } from '@/components/modals/confirm-modal/confirm-modal';
import { Button } from '@/components/primitives/button';
import { TourSettlementCancelLogModal } from '@/components/modals/tour-settlement-cancel-log-modal/tour-settlement-cancel-log-modal';
import { TourResponse } from '@/interfaces/tour-interfaces';

interface TourSettlementSignatureContentProps {
  tourData: TourResponse;
  onOpenSignatureInfoPopover?: () => void;
}

export default function TourSettlementSignatureContent({
  tourData,
  onOpenSignatureInfoPopover,
}: TourSettlementSignatureContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSignConfirmVisible, setIsSignConfirmVisible] = useState(false);
  const [isCancelConfirmVisible, setIsCancelConfirmVisible] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(
    null
  );

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const modalRef = useRef<SlideSheetRef | null>(null);
  const cancelLogModalRef = useRef<SlideSheetRef | null>(null);
  const handleOpenSignerSelectModal = () => {
    modalRef.current?.open();
  };
  const handleOpenCancelLogModal = () => {
    cancelLogModalRef.current?.open();
  };

  const { currentUser } = useAuthContext();
  const {
    data: tourSettlementSignatures,
    isLoading,
    executeFetchFn: fetchSignatures,
  } = useFetchFn(
    () => getSignaturesByDocumentIdApi(tourData.tourSettlement?.id || ''),
    {
      tags: ['signature-list-in-tour-settlement'],
    }
  );

  const { data: organizationMembers, executeFetchFn: fetchOrganizationMembers } =
    useFetchFn(
      () =>
        getOrganizationMembersByOrganizationIdApi(tourData.organization?.id || ''),
      {
        tags: ['organization-members'],
      }
    );

  useEffect(() => {
    if (!tourData.tourSettlement?.id) return;
    fetchSignatures();
    fetchOrganizationMembers();
  }, [tourData.tourSettlement?.id, fetchSignatures, fetchOrganizationMembers]);

  const manageReceiverSignaturesFn = (targetUserIds: string[]) =>
    manageReceiverSignaturesApi({
      documentId: tourData.tourSettlement?.id || '',
      documentType: 'TOUR_SETTLEMENT',
      organizationId: tourData.organization?.id || '',
      targetUserIds,
    });

  const signTourSettlementFn = (id: string) => signSignatureApi(id);
  const cancelTourSettlementFn = (id: string) => cancelSignatureApi(id);

  const {
    executeMutationFn: manageReceiverSignatures,
    isMutating: isManagingReceiverSignatures,
  } = useMutationFn(manageReceiverSignaturesFn, {
    invalidatesTags: ['signature-list-in-tour-settlement'],
  });

  const {
    executeMutationFn: signTourSettlement,
    isMutating: isSigningTourSettlement,
  } = useMutationFn(signTourSettlementFn, {
    invalidatesTags: ['signature-list-in-tour-settlement'],
  });

  const {
    executeMutationFn: cancelTourSettlement,
    isMutating: isCancelingTourSettlement,
  } = useMutationFn(cancelTourSettlementFn, {
    invalidatesTags: [
      'signature-list-in-tour-settlement',
      'tour-settlement-cancel-logs',
    ],
  });

  const handleConfirmSelectedOrganizationMembers = (
    selectedOrganizationMemberUserIds: string[],
    onSuccessCallback?: () => void
  ) => {
    const senderUserId = tourSettlementSignatures?.find(
      (sig) => sig.signatureRole === 'SENDER'
    )?.targetUserId;

    const selectedOrganizationMemberUserIdsWithoutSender =
      selectedOrganizationMemberUserIds.filter((id) => id !== senderUserId);

    manageReceiverSignatures(selectedOrganizationMemberUserIdsWithoutSender, {
      onSuccess: () => {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        modalRef.current?.close();
      },
      onError: (error) => {
        console.error('Error managing receiver signatures:', error);
      },
    });
  };

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

  const handleConfirmSignTourSettlement = () => {
    if (!selectedSignatureId) return;

    signTourSettlement(selectedSignatureId, {
      onSuccess: () => {
        handleCloseSignConfirmModal();
      },
      onError: (error) => {
        console.error('Error signing tour settlement:', error);
      },
    });
  };

  const handleConfirmCancelTourSettlement = () => {
    if (!selectedSignatureId) return;

    cancelTourSettlement(selectedSignatureId, {
      onSuccess: () => {
        handleCloseCancelConfirmModal();
      },
      onError: (error) => {
        console.error('Error canceling signature:', error);
      },
    });
  };

  const sender = tourSettlementSignatures?.find(
    (s) => s.signatureRole === 'SENDER'
  );
  const receivers = tourSettlementSignatures?.filter(
    (s) => s.signatureRole === 'RECEIVER'
  );
  const hasUnsignedSender =
    tourSettlementSignatures?.some(
      (signature) => signature.signatureRole === 'SENDER' && !signature.isSigned
    ) ?? false;

  const isTourSettlementPrivate = receivers?.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={toggleExpand} hitSlop={8}>
            <VinaupExpand
              width={16}
              height={16}
              color={isExpanded ? 'gray' : COLORS.vinaupTeal}
            />
          </Pressable>
          <View style={styles.leftContent}>
            <Text style={styles.titleUnderline}>Ký tên</Text>
            <PressableOpacity onPress={onOpenSignatureInfoPopover} hitSlop={8}>
              <Ionicons
                name="information-circle-sharp"
                size={24}
                color={COLORS.vinaupYellow}
              />
            </PressableOpacity>
            <Button
              style={styles.logButton}
              onPress={handleOpenCancelLogModal}
              disabled={!tourData.tourSettlement?.id}
            >
              <Text style={styles.logButtonText}>Nhật ký</Text>
            </Button>
          </View>
        </View>
        <View style={styles.headerRight}>
          {isTourSettlementPrivate && (
            <Text style={styles.statusLabel}>Chỉ bạn nhìn thấy</Text>
          )}
          <PressableOpacity
            onPress={handleOpenSignerSelectModal}
            disabled={isLoading || isManagingReceiverSignatures}
          >
            <Feather name={'user-plus'} size={24} color={COLORS.vinaupTeal} />
          </PressableOpacity>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.signaturesGroup}>
          <View style={styles.signatureColumnLeft}>
            <Text style={styles.roleText}>Người tạo</Text>
            <SignatureEntityContent
              isSigned={sender?.isSigned}
              isAllowToSign={true}
              signatureTargetUserId={sender?.targetUserId}
              currentUserId={currentUser?.id}
              role="SENDER"
              isLoading={
                isLoading || isSigningTourSettlement || isCancelingTourSettlement
              }
              alignment="left"
              onSign={() => handleOpenSignConfirmModal(sender?.id, true)}
              onCancel={() => handleOpenCancelConfirmModal(sender?.id)}
            />
            <Text style={styles.nameText}>{sender?.targetUser?.name}</Text>
            {sender?.isSigned && (
              <Text style={styles.timeText}>
                {dayjs(sender.signedAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            )}
          </View>

          <View style={styles.signatureColumnRight}>
            <Text style={styles.roleText}>Người nhận</Text>
            {receivers?.map((receiver, index) => (
              <View key={receiver.id}>
                <SignatureEntityContent
                  isSigned={receiver.isSigned}
                  isAllowToSign={!hasUnsignedSender}
                  signatureTargetUserId={receiver.targetUserId}
                  currentUserId={currentUser?.id}
                  role="RECEIVER"
                  isLoading={
                    isLoading ||
                    isSigningTourSettlement ||
                    isCancelingTourSettlement
                  }
                  alignment="right"
                  onSign={() =>
                    handleOpenSignConfirmModal(receiver?.id, !hasUnsignedSender)
                  }
                  onCancel={() => handleOpenCancelConfirmModal(receiver?.id)}
                />
                <Text style={styles.nameText}>{receiver?.targetUser?.name}</Text>
                {receiver.isSigned && (
                  <View style={styles.signatureInfo}>
                    <Text style={styles.timeText}>
                      {dayjs(receiver.signedAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                    <Text style={styles.nameText}>{receiver.targetUser?.name}</Text>
                  </View>
                )}
                {receivers.length > 1 && index < receivers.length - 1 && (
                  <Text style={styles.divider}>---</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}
      <SignerSelectModal
        modalRef={modalRef}
        organizationMembers={organizationMembers?.filter(
          (member) => member.user?.id !== sender?.targetUserId
        )}
        isLoading={isLoading || isManagingReceiverSignatures}
        onConfirm={handleConfirmSelectedOrganizationMembers}
        receiverSignatures={receivers}
      />
      <ConfirmModal
        visible={isSignConfirmVisible}
        headerTitle="Xác nhận ký tên"
        confirmText="Xác nhận"
        cancelText="Huỷ"
        isLoading={isSigningTourSettlement}
        onClose={handleCloseSignConfirmModal}
        onConfirm={handleConfirmSignTourSettlement}
      />
      <ConfirmModal
        visible={isCancelConfirmVisible}
        headerTitle="Xác nhận huỷ ký"
        confirmText="Huỷ ký"
        cancelText="Đóng"
        isLoading={isCancelingTourSettlement}
        onClose={handleCloseCancelConfirmModal}
        onConfirm={handleConfirmCancelTourSettlement}
      />
      <TourSettlementCancelLogModal
        tourData={tourData}
        modalRef={cancelLogModalRef}
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
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  titleUnderline: {
    fontSize: 16,
    marginRight: 6,
  },
  logButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    backgroundColor: COLORS.vinaupWhite,
  },
  logButtonText: {
    fontSize: 14,
    color: COLORS.vinaupTeal,
    fontWeight: '500',
  },
  statusLabel: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.vinaupRed,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    color: COLORS.vinaupMediumDarkGray,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
    fontStyle: 'italic',
    marginTop: 2,
  },
  nameText: {
    fontSize: 16,
    marginTop: 6,
  },
  signatureInfo: {
    alignItems: 'flex-end',
  },
  divider: {
    textAlign: 'right',
    marginVertical: 2,
    fontSize: 12,
  },
});
