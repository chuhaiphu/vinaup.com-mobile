import {
  getSignaturesByDocumentIdApi,
  manageReceiverSignaturesApi,
  signSignatureApi,
} from '@/apis/signature-apis';
import { useFetchFn, useMutationFn } from 'fetchwire';
import { useContext, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SignatureEntityContent from '../signature/signature-entity-content';
import VinaupUnlock from '@/components/icons/vinaup-unlock.native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { COLORS } from '@/constants/style-constant';
import { AuthContext } from '@/providers/auth-provider';
import VinaupExpand from '@/components/icons/vinaup-expand.native';
import { SignerSelectModal } from '@/components/modals/signer-select-modal/signer-select-modal';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { getOrganizationMembersByOrganizationIdApi } from '@/apis/organization-apis';
import { ConfirmModal } from '@/components/modals/confirm-modal/confirm-modal';

interface TourCalculationSignatureContentProps {
  organizationId: string;
  tourCalculationId: string;
}

export default function TourCalculationSignatureContent({
  organizationId,
  tourCalculationId,
}: TourCalculationSignatureContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSignConfirmVisible, setIsSignConfirmVisible] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(
    null
  );

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const modalRef = useRef<SlideSheetRef | null>(null);
  const handleOpenSignerSelectModal = () => {
    modalRef.current?.open();
  };

  const { currentUser } = useContext(AuthContext);
  const {
    data: tourCalculationSignatures,
    isLoading,
    executeFetchFn: fetchSignatures,
  } = useFetchFn(() => getSignaturesByDocumentIdApi(tourCalculationId), {
    tags: ['signature-list-in-tour-calculation'],
  });

  const { data: organizationMembers, executeFetchFn: fetchOrganizationMembers } =
    useFetchFn(() => getOrganizationMembersByOrganizationIdApi(organizationId), {
      tags: ['organization-members'],
    });

  useEffect(() => {
    if (!tourCalculationId) return;
    fetchSignatures();
    fetchOrganizationMembers();
  }, [
    tourCalculationId,
    organizationId,
    fetchSignatures,
    fetchOrganizationMembers,
  ]);

  const manageReceiverSignaturesFn = (targetUserIds: string[]) =>
    manageReceiverSignaturesApi({
      documentId: tourCalculationId,
      documentType: 'TOUR_CALCULATION',
      organizationId,
      targetUserIds,
    });

  const signTourCalculationFn = (id: string) => signSignatureApi(id);

  const {
    executeMutationFn: manageReceiverSignatures,
    isMutating: isManagingReceiverSignatures,
  } = useMutationFn(manageReceiverSignaturesFn, {
    invalidatesTags: ['signature-list-in-tour-calculation'],
  });

  const {
    executeMutationFn: signTourCalculation,
    isMutating: isSigningTourCalculation,
  } = useMutationFn(signTourCalculationFn, {
    invalidatesTags: ['signature-list-in-tour-calculation'],
  });

  const handleConfirmSelectedOrganizationMembers = (
    selectedOrganizationMemberUserIds: string[],
    onSuccessCallback?: () => void
  ) => {
    const senderUserId = tourCalculationSignatures?.find(
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

  const handleOpenSignConfirmModal = (signatureId?: string) => {
    if (!signatureId) return;
    setSelectedSignatureId(signatureId);
    setIsSignConfirmVisible(true);
  };

  const handleCloseSignConfirmModal = () => {
    setIsSignConfirmVisible(false);
    setSelectedSignatureId(null);
  };

  const handleConfirmSignTourCalculation = () => {
    if (!selectedSignatureId) return;

    signTourCalculation(selectedSignatureId, {
      onSuccess: () => {
        handleCloseSignConfirmModal();
      },
      onError: (error) => {
        console.error('Error signing tour calculation:', error);
      },
    });
  };

  const sender = tourCalculationSignatures?.find(
    (s) => s.signatureRole === 'SENDER'
  );
  const receivers = tourCalculationSignatures?.filter(
    (s) => s.signatureRole === 'RECEIVER'
  );

  const isTourCalculationPrivate = receivers?.length === 0;
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
            <Ionicons
              name="information-circle-sharp"
              size={24}
              color={COLORS.vinaupYellow}
            />
          </View>
        </View>
        <View style={styles.headerRight}>
          {isTourCalculationPrivate && (
            <Text style={styles.statusLabel}>Chỉ bạn nhìn thấy</Text>
          )}
          <PressableOpacity
            onPress={handleOpenSignerSelectModal}
            disabled={isLoading || isManagingReceiverSignatures}
          >
            <Feather
              name={receivers && receivers.length > 0 ? 'user-minus' : 'user-plus'}
              size={24}
              color={COLORS.vinaupTeal}
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
              signatureTargetUserId={sender?.targetUserId}
              currentUserId={currentUser?.id}
              role="SENDER"
              isLoading={isLoading || isSigningTourCalculation}
              alignment="left"
              onSign={() => handleOpenSignConfirmModal(sender?.id)}
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
                  signatureTargetUserId={receiver.targetUserId}
                  currentUserId={currentUser?.id}
                  role="RECEIVER"
                  isLoading={isLoading || isSigningTourCalculation}
                  alignment="right"
                  onSign={() => handleOpenSignConfirmModal(receiver?.id)}
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
        isLoading={isSigningTourCalculation}
        onClose={handleCloseSignConfirmModal}
        onConfirm={handleConfirmSignTourCalculation}
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
    gap: 6,
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
  iconLock: {
    marginRight: 4,
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
