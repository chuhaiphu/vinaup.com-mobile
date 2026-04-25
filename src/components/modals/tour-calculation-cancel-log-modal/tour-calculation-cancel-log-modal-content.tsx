import { getTourCalculationLogsByTourCalculationIdApi } from '@/apis/tour-apis';
import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';
import { TourCalculationCancelLogResponse } from '@/interfaces/tour-calculation-interfaces';
import { Feather } from '@expo/vector-icons';
import { useFetchFn } from 'fetchwire';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TourResponse } from '@/interfaces/tour-interfaces';
import { useRouter } from 'expo-router';

interface TourCalculationCancelLogModalContentProps {
  tourData: TourResponse;
  onCloseRequest?: () => void;
}

export function TourCalculationCancelLogModalContent({
  tourData,
  onCloseRequest,
}: TourCalculationCancelLogModalContentProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    data: cancelLogs,
    isLoading,
    executeFetchFn: fetchCancelLogs,
  } = useFetchFn(
    () =>
      getTourCalculationLogsByTourCalculationIdApi(
        tourData.tourCalculation?.id || ''
      ),
    {
      fetchKey: `tour-calculation-cancel-logs-${tourData.tourCalculation?.id}`,
      tags: [`tour-calculation-cancel-logs-${tourData.tourCalculation?.id}`],
    }
  );

  useEffect(() => {
    if (!tourData.tourCalculation?.id) {
      return;
    }
    fetchCancelLogs();
  }, [tourData.tourCalculation?.id, fetchCancelLogs]);

  const handleRetry = () => {
    fetchCancelLogs();
  };

  const handlePressLog = (log: TourCalculationCancelLogResponse) => {
    router.push({
      pathname:
        '/(protected)/tour-calculation-cancel-log-detail/[tourCalculationCancelLogId]',
      params: {
        tourCalculationId: log.tourCalculationId,
        tourCalculationCancelLogId: log.id,
        organizationId: tourData.organization?.id,
      },
    });
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhật ký</Text>
        <Pressable onPress={onCloseRequest} hitSlop={8}>
          <Feather name="x" size={28} color="#D35400" />
        </Pressable>
      </View>
      <View style={styles.headerDivider} />

      <Text style={styles.orgName}>{tourData.organization?.name}</Text>

      {isLoading && (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="small" color={COLORS.vinaupTeal} />
        </View>
      )}

      {!isLoading && (!cancelLogs || cancelLogs.length === 0) && (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Chưa có nhật ký hủy ký.</Text>
          <Button style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tải lại</Text>
          </Button>
        </View>
      )}

      {!isLoading && cancelLogs && cancelLogs.length > 0 && (
        <FlatList
          data={cancelLogs}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handlePressLog(item)}
              style={({ pressed }) => [
                styles.logRowItem,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.tourTitleText} numberOfLines={1}>
                {tourData.description}
              </Text>
              <Text style={styles.timeText}>
                {dayjs(item.createdAt).format('DD/MM/YY HH:mm')}
              </Text>
            </Pressable>
          )}
        />
      )}
      <View style={styles.footerContainer}>
        <View>
          <Text style={styles.creatorText}>
            Người tạo: {tourData.createdBy?.name || '---'}
          </Text>
        </View>
        <View style={styles.doubleLineSeparator} />
        <Text style={styles.footerNoteText}>* Nhật ký lưu tối đa 5 lần</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.vinaupWhite,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: COLORS.vinaupBlack,
  },
  headerDivider: {
    height: 3,
    backgroundColor: COLORS.vinaupMediumGray,
    marginBottom: 16,
  },
  orgName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.vinaupBlack,
    marginBottom: 16,
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  stateText: {
    color: COLORS.vinaupMediumDarkGray,
    fontSize: 14,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
  },
  retryButtonText: {
    color: COLORS.vinaupTeal,
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 4,
  },
  logRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.vinaupSoftGray,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  tourTitleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
    marginRight: 8,
  },
  timeText: {
    color: COLORS.vinaupMediumDarkGray,
  },
  footerContainer: {
    marginTop: 16,
  },
  creatorText: {
    fontSize: 16,
  },
  doubleLineSeparator: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 4,
    marginVertical: 12,
  },
  footerNoteText: {
    fontSize: 15,
    color: COLORS.vinaupBlack,
  },
});
