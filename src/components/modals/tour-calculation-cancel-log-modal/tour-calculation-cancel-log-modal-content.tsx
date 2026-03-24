import { getTourCalculationLogsByTourCalculationIdApi } from '@/apis/tour-apis';
import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';
import {
  TourCalculationCancelLogResponse,
  TourCalculationCancelLogSnapshotData,
} from '@/interfaces/tour-calculation-interfaces';
import { createAndShareTourCalculationCancelLogPdf } from '@/utils/tour-calculation-cancel-log-pdf';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFetchFn } from 'fetchwire';
import dayjs from 'dayjs';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TourCalculationCancelLogModalContentProps {
  tourCalculationId: string;
  onCloseRequest?: () => void;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null;
}

function parseSnapshotData(
  log: TourCalculationCancelLogResponse
): TourCalculationCancelLogSnapshotData {
  const rawSnapshot = isObject(log.snapshotData)
    ? (log.snapshotData as Record<string, unknown>)
    : {};

  const rawTourCalculation = isObject(rawSnapshot.tourCalculation)
    ? rawSnapshot.tourCalculation
    : {};

  const rawSignatures = Array.isArray(rawSnapshot.signatures)
    ? rawSnapshot.signatures
    : [];

  return {
    tourCalculation: rawTourCalculation,
    signatures: rawSignatures,
  };
}

function getFileExt(url: string): string {
  const withoutQuery = url.split('?')[0];
  const lastDotIndex = withoutQuery.lastIndexOf('.');
  if (lastDotIndex < 0) return '';
  return withoutQuery.slice(lastDotIndex + 1).toLowerCase();
}

function isImageUrl(url: string): boolean {
  const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'];
  return imageExts.includes(getFileExt(url));
}

function isPdfUrl(url: string): boolean {
  return getFileExt(url) === 'pdf';
}

function buildSummary(log: TourCalculationCancelLogResponse): string {
  const snapshot = parseSnapshotData(log);
  const signaturesCount = snapshot.signatures.length;
  const hasFileCount = snapshot.signatures.filter(
    (signature) => !!signature.url
  ).length;

  return `${signaturesCount} chu ky, ${hasFileCount} tep`;
}

function formatNumber(value: unknown): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '-';
  }

  return new Intl.NumberFormat('vi-VN').format(value);
}

export function TourCalculationCancelLogModalContent({
  tourCalculationId,
  onCloseRequest,
}: TourCalculationCancelLogModalContentProps) {
  const insets = useSafeAreaInsets();
  const [selectedLog, setSelectedLog] =
    useState<TourCalculationCancelLogResponse | null>(null);
  const [exportingLogId, setExportingLogId] = useState<string | null>(null);

  const {
    data: cancelLogs,
    isLoading,
    executeFetchFn: fetchCancelLogs,
  } = useFetchFn(
    () => getTourCalculationLogsByTourCalculationIdApi(tourCalculationId),
    {
      tags: ['tour-calculation-cancel-logs'],
    }
  );

  useEffect(() => {
    if (!tourCalculationId) {
      return;
    }

    fetchCancelLogs();
  }, [tourCalculationId, fetchCancelLogs]);

  const selectedSnapshot = useMemo(() => {
    if (!selectedLog) {
      return null;
    }

    return parseSnapshotData(selectedLog);
  }, [selectedLog]);

  const fileUrls = useMemo(() => {
    if (!selectedSnapshot) {
      return [];
    }

    const urls = selectedSnapshot.signatures
      .map((signature) => signature.url)
      .filter((url): url is string => typeof url === 'string' && url.length > 0);

    return Array.from(new Set(urls));
  }, [selectedSnapshot]);

  const handleOpenFile = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    } catch (error) {
      console.error('Cannot open file URL:', error);
      Alert.alert('Khong mo duoc tep', 'Vui long thu lai sau.');
    }
  };

  const handleExportPdf = async (log: TourCalculationCancelLogResponse) => {
    try {
      setExportingLogId(log.id);
      await createAndShareTourCalculationCancelLogPdf(log);
    } catch (error) {
      console.error('Cannot export PDF:', error);
      Alert.alert('Xuat PDF that bai', 'Vui long thu lai sau.');
    } finally {
      setExportingLogId(null);
    }
  };

  const handleRetry = () => {
    fetchCancelLogs();
  };

  if (selectedLog && selectedSnapshot) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.topBar}>
          <Button style={styles.backButton} onPress={() => setSelectedLog(null)}>
            <Text style={styles.backButtonText}>Quay lai</Text>
          </Button>
          <Text style={styles.title}>Chi tiet nhat ky</Text>
          <Button style={styles.closeButton} onPress={onCloseRequest}>
            <Text style={styles.closeButtonText}>Dong</Text>
          </Button>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Thong tin huy</Text>
            <Text style={styles.metaText}>
              Nguoi huy: {selectedLog.canceledByUser?.name || '-'}
            </Text>
            <Text style={styles.metaText}>
              Thoi gian: {dayjs(selectedLog.createdAt).format('DD/MM/YYYY HH:mm')}
            </Text>
            <Text style={styles.metaText}>
              Log ID: {selectedLog.id.slice(0, 8)}
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Snapshot Tour Calculation</Text>
            <Text style={styles.metaText}>
              Ve nguoi lon:{' '}
              {formatNumber(selectedSnapshot.tourCalculation.adultTicketCount)}
            </Text>
            <Text style={styles.metaText}>
              Ve tre em:{' '}
              {formatNumber(selectedSnapshot.tourCalculation.childTicketCount)}
            </Text>
            <Text style={styles.metaText}>
              Gia ve nguoi lon:{' '}
              {formatNumber(selectedSnapshot.tourCalculation.adultTicketPrice)}
            </Text>
            <Text style={styles.metaText}>
              Gia ve tre em:{' '}
              {formatNumber(selectedSnapshot.tourCalculation.childTicketPrice)}
            </Text>
            <Text style={styles.metaText}>
              Thue (%): {formatNumber(selectedSnapshot.tourCalculation.taxRate)}
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Danh sach chu ky</Text>
            {selectedSnapshot.signatures.length === 0 && (
              <Text style={styles.emptyText}>Khong co chu ky trong snapshot.</Text>
            )}
            {selectedSnapshot.signatures.map((signature) => (
              <View key={signature.id} style={styles.signatureItem}>
                <Text style={styles.signatureTitle}>
                  {signature.signatureRole} - {signature.targetUser?.name || '-'}
                </Text>
                <Text style={styles.metaText}>
                  Trang thai: {signature.isSigned ? 'Da ky' : 'Chua ky'}
                </Text>
                <Text style={styles.metaText}>
                  Ky luc:{' '}
                  {signature.signedAt
                    ? dayjs(signature.signedAt).format('DD/MM/YYYY HH:mm')
                    : '-'}
                </Text>
                {signature.url ? (
                  <Button
                    style={styles.openFileButton}
                    onPress={() => handleOpenFile(signature.url || '')}
                  >
                    <Text style={styles.openFileButtonText}>Mo tep</Text>
                  </Button>
                ) : (
                  <Text style={styles.fileHint}>Khong co tep dinh kem</Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Preview tep</Text>
            {fileUrls.length === 0 && (
              <Text style={styles.emptyText}>Khong co URL tep de preview.</Text>
            )}
            {fileUrls.map((url) => (
              <View key={url} style={styles.fileItem}>
                <View style={styles.fileHeader}>
                  <Feather
                    name={isPdfUrl(url) ? 'file-text' : 'image'}
                    color={COLORS.vinaupTeal}
                    size={18}
                  />
                  <Text style={styles.fileTypeLabel}>
                    {isPdfUrl(url)
                      ? 'PDF'
                      : isImageUrl(url)
                        ? 'Hinh anh'
                        : 'Tai lieu'}
                  </Text>
                </View>

                {isImageUrl(url) && (
                  <Image
                    source={{ uri: url }}
                    style={styles.previewImage}
                    contentFit="cover"
                  />
                )}

                <Button
                  style={styles.openFileButton}
                  onPress={() => handleOpenFile(url)}
                >
                  <Text style={styles.openFileButtonText}>Xem tep</Text>
                </Button>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footerButtons}>
          <Button
            style={[
              styles.exportButton,
              exportingLogId === selectedLog.id && styles.disabledButton,
            ]}
            onPress={() => handleExportPdf(selectedLog)}
            disabled={exportingLogId != null}
            isLoading={exportingLogId === selectedLog.id}
            loaderStyle={{ color: COLORS.vinaupWhite }}
          >
            <Text style={styles.exportButtonText}>Xuat/Luu PDF</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Nhat ky huy ky</Text>
        <Button style={styles.closeButton} onPress={onCloseRequest}>
          <Text style={styles.closeButtonText}>Dong</Text>
        </Button>
      </View>

      {isLoading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="small" color={COLORS.vinaupTeal} />
          <Text style={styles.stateText}>Dang tai nhat ky...</Text>
        </View>
      ) : null}

      {!isLoading && (!cancelLogs || cancelLogs.length === 0) ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Chua co nhat ky huy ky.</Text>
          <Button style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tai lai</Text>
          </Button>
        </View>
      ) : null}

      {!isLoading && cancelLogs && cancelLogs.length > 0 ? (
        <FlatList
          data={cancelLogs}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text style={styles.logItemTitle}>
                {item.canceledByUser?.name || 'Khong ro'}
              </Text>
              <Text style={styles.logItemMeta}>
                {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
              <Text style={styles.logItemMeta}>{buildSummary(item)}</Text>
              <Pressable
                onPress={() => setSelectedLog(item)}
                style={({ pressed }) => [
                  styles.detailAction,
                  pressed && styles.detailActionPressed,
                ]}
              >
                <Text style={styles.detailActionText}>Xem chi tiet</Text>
              </Pressable>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.vinaupWhite,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupBlack,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.vinaupSoftGray,
  },
  closeButtonText: {
    color: COLORS.vinaupBlack,
    fontSize: 14,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.vinaupSoftGray,
  },
  backButtonText: {
    color: COLORS.vinaupBlack,
    fontSize: 14,
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
    paddingBottom: 12,
    gap: 10,
  },
  logItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    backgroundColor: COLORS.vinaupLightWhite,
    padding: 12,
    gap: 4,
  },
  logItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupBlack,
  },
  logItemMeta: {
    fontSize: 13,
    color: COLORS.vinaupMediumDarkGray,
  },
  detailAction: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.vinaupSoftYellow,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  detailActionPressed: {
    opacity: 0.8,
  },
  detailActionText: {
    color: COLORS.vinaupTeal,
    fontSize: 13,
    fontWeight: '500',
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 10,
    backgroundColor: COLORS.vinaupLightWhite,
    padding: 12,
    marginBottom: 10,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.vinaupBlack,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.vinaupMediumDarkGray,
  },
  signatureItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupSoftGray,
    gap: 2,
  },
  signatureTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.vinaupBlack,
  },
  openFileButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  openFileButtonText: {
    color: COLORS.vinaupTeal,
    fontSize: 13,
    fontWeight: '500',
  },
  fileHint: {
    color: COLORS.vinaupMediumGray,
    fontSize: 12,
    marginTop: 4,
  },
  fileItem: {
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fileTypeLabel: {
    color: COLORS.vinaupMediumDarkGray,
    fontSize: 13,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    backgroundColor: COLORS.vinaupSoftGray,
    marginTop: 8,
  },
  emptyText: {
    color: COLORS.vinaupMediumGray,
    fontSize: 13,
  },
  footerButtons: {
    paddingTop: 8,
  },
  exportButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.vinaupTeal,
  },
  exportButtonText: {
    color: COLORS.vinaupWhite,
    fontSize: 15,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
