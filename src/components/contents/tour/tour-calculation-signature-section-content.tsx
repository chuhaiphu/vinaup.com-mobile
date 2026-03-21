import { getSignaturesByDocumentIdApi } from '@/apis/signature-apis';
import { useFetchFn } from 'fetchwire';
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SignatureEntityContent from '../signature/signature-entity-content';
import VinaupUnlock from '@/components/icons/vinaup-unlock.native';
import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { COLORS } from '@/constants/style-constant';
import { AuthContext } from '@/providers/auth-provider';
import VinaupExpand from '@/components/icons/vinaup-expand.native';

interface TourCalculationSignatureContentProps {
  tourCalculationId: string;
}

export default function TourCalculationSignatureContent({
  tourCalculationId,
}: TourCalculationSignatureContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const { currentUser } = useContext(AuthContext);
  const {
    data: tourCalculationSignatures,
    isLoading,
    executeFetchFn: fetchSignatures,
  } = useFetchFn(() => getSignaturesByDocumentIdApi(tourCalculationId), {
    tags: ['signature-list-in-tour-calculation'],
  });

  useEffect(() => {
    fetchSignatures();
  }, [tourCalculationId, fetchSignatures]);

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
            <Text style={styles.titleUnderline}>Trình ký</Text>
            <VinaupUnlock width={16} height={16} color={COLORS.vinaupTeal} />
          </View>
        </View>
        <View style={styles.headerRight}>
          {isTourCalculationPrivate && (
            <Text style={styles.statusLabel}>Chỉ bạn nhìn thấy</Text>
          )}
          <Feather name="user-plus" size={24} color={COLORS.vinaupTeal} />
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
              isLoading={isLoading}
              alignment="left"
            />
            <Text style={styles.nameText}>{sender?.targetUser?.name}</Text>
            {sender?.isSigned && (
              <Text style={styles.timeText}>
                {dayjs(sender.signedAt).format('DD/MM/YYYY HH:mm:ss')}
              </Text>
            )}
          </View>

          <View style={styles.signatureColumnRight}>
            <Text style={styles.roleText}>Người nhận</Text>
            {/* <SignatureEntityContent
            isSigned={receiver?.isSigned}
            signatureTargetUserId={receiver?.targetUserId}
            currentUserId={currentUser?.id}
            role="RECEIVER"
            isLoading={isLoading}
            alignment="right"
          />
          {receiver?.isSigned && (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.timeText}>
                {dayjs(receiver.signedAt).format('DD/MM/YYYY HH:mm:ss')}
              </Text>
              <Text style={styles.nameText}>{receiver.targetUser?.name}</Text>
            </View>
          )} */}
          </View>
        </View>
      )}
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
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  nameText: {
    fontSize: 16,
    marginTop: 6,
  },
});
