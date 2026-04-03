import { getTourSettlementCancelLogByIdApi } from '@/apis/tour-apis';
import VinaupLeftArrowTwoLayers from '@/components/icons/vinaup-left-arrow-two-layers.native';
import VinaupUserArrowUpRight from '@/components/icons/vinaup-user-arrow-up-right.native';
import VinaupUserChecked from '@/components/icons/vinaup-user-checked.native';
import { Button } from '@/components/primitives/button';
import { PdfPageSizeModal } from '@/components/modals/pdf-page-size-modal/pdf-page-size-modal';
import { COLORS } from '@/constants/style-constant';
import { TourSettlementCancelLogSnapshotData } from '@/interfaces/tour-settlement-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { SignatureResponse } from '@/interfaces/signature-interfaces';
import { calculateTourTicketSummaries } from '@/utils/calculator-helpers';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import {
  createAndShareTourSettlementCancelLogPdf,
  type PdfPageSize,
} from '@/utils/tour-settlement-cancel-log-pdf';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useFetchFn } from 'fetchwire';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { getOrganizationByIdApi } from '@/apis/organization-apis';
import { Avatar } from '@/components/primitives/avatar';

function formatDateTime(value?: string | Date | null): string {
  if (!value) {
    return '-';
  }

  const formatted = dayjs(value);
  if (!formatted.isValid()) {
    return '-';
  }

  return formatted.format('DD/MM HH:mm');
}

export default function TourSettlementCancelLogDetail() {
  const router = useRouter();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPageSizeModalVisible, setIsPageSizeModalVisible] = useState(false);
  const { tourSettlementCancelLogId, organizationId } = useLocalSearchParams<{
    tourSettlementCancelLogId?: string;
    organizationId?: string;
  }>();

  const {
    data: cancelLog,
    isLoading,
    executeFetchFn: fetchCancelLog,
  } = useFetchFn(
    () => getTourSettlementCancelLogByIdApi(tourSettlementCancelLogId || ''),
    {
      tags: ['tour-settlement-cancel-log-detail'],
    }
  );

  const { data: organization, executeFetchFn: fetchOrganization } = useFetchFn(() =>
    getOrganizationByIdApi(organizationId || '')
  );

  useEffect(() => {
    if (!tourSettlementCancelLogId) {
      return;
    }
    fetchCancelLog();
    fetchOrganization();
  }, [tourSettlementCancelLogId, fetchCancelLog, fetchOrganization]);

  const parsedSnapshot = (() => {
    const rawSnapshot =
      (cancelLog?.snapshotData as
        | TourSettlementCancelLogSnapshotData
        | Record<string, unknown>
        | undefined) || {};

    const tourSettlementRaw =
      typeof rawSnapshot === 'object' &&
      rawSnapshot !== null &&
      'tourSettlement' in rawSnapshot &&
      typeof rawSnapshot.tourSettlement === 'object' &&
      rawSnapshot.tourSettlement !== null
        ? rawSnapshot.tourSettlement
        : {};

    const signaturesRaw =
      typeof rawSnapshot === 'object' &&
      rawSnapshot !== null &&
      'signatures' in rawSnapshot &&
      Array.isArray(rawSnapshot.signatures)
        ? rawSnapshot.signatures
        : [];

    return {
      tourSettlement: tourSettlementRaw,
      signatures: signaturesRaw as SignatureResponse[],
    };
  })();

  const snapshotTour =
    (parsedSnapshot.tourSettlement as {
      tour?: {
        description?: string;
        startDate?: string | Date;
        endDate?: string | Date;
        code?: string;
        note?: string | null;
        organization?: { name?: string | null } | null;
        organizationCustomer?: { name?: string | null } | null;
        externalOrganizationName?: string | null;
        externalCustomerName?: string | null;
      };
      receiptPayments?: ReceiptPaymentResponse[];
      adultTicketCount?: number;
      childTicketCount?: number;
      adultTicketPrice?: number;
      childTicketPrice?: number;
      taxRate?: number;
    }) || {};

  const receiptPayments =
    (snapshotTour.receiptPayments as ReceiptPaymentResponse[] | undefined) || [];

  const ticketSummary = calculateTourTicketSummaries(receiptPayments, {
    adultTicketCount: Number(snapshotTour.adultTicketCount),
    childTicketCount: Number(snapshotTour.childTicketCount),
    adultTicketPrice: Number(snapshotTour.adultTicketPrice),
    childTicketPrice: Number(snapshotTour.childTicketPrice),
    taxRate: Number(snapshotTour.taxRate),
  });

  const groupedReceiptPayments = (() => {
    const groups = new Map<string, ReceiptPaymentResponse[]>();

    receiptPayments.forEach((item) => {
      const groupLabel = dayjs(item.transactionDate).isValid()
        ? dayjs(item.transactionDate).format('DD/MM')
        : '-';

      const current = groups.get(groupLabel) || [];
      groups.set(groupLabel, [...current, item]);
    });

    return Array.from(groups.entries())
      .map(([label, items]) => ({
        label,
        items,
        sortTimestamp: dayjs(items[0]?.transactionDate).valueOf() || 0,
      }))
      .sort((a, b) => b.sortTimestamp - a.sortTimestamp);
  })();

  const senderSignature = parsedSnapshot.signatures.find(
    (signature) => signature.signatureRole === 'SENDER'
  );

  const receiverSignatures = parsedSnapshot.signatures.filter(
    (signature) => signature.signatureRole === 'RECEIVER'
  );

  const customerName =
    snapshotTour.tour?.organizationCustomer?.name ||
    snapshotTour.tour?.externalCustomerName ||
    '-';

  const totalExpectedCount =
    Number(snapshotTour.adultTicketCount) + Number(snapshotTour.childTicketCount);

  const handleRetry = () => {
    if (!tourSettlementCancelLogId) {
      return;
    }
    fetchCancelLog();
  };

  const handleExportPdf = async (pageSize: PdfPageSize) => {
    if (!cancelLog || isGeneratingPdf) {
      return;
    }

    try {
      setIsGeneratingPdf(true);

      await createAndShareTourSettlementCancelLogPdf({
        cancelLog,
        organization: organization || undefined,
        snapshotTour,
        ticketSummary,
        groupedReceiptPayments,
        senderSignature,
        receiverSignatures,
        customerName,
        totalExpectedCount,
        pageSize,
      });
    } catch {
      Alert.alert('Không thể xuất PDF', 'Vui lòng thử lại sau.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePressPdf = () => {
    if (!cancelLog || isGeneratingPdf) {
      return;
    }
    setIsPageSizeModalVisible(true);
  };

  const handleClosePageSizeModal = () => {
    if (isGeneratingPdf) {
      return;
    }
    setIsPageSizeModalVisible(false);
  };

  const handleSelectPageSize = (pageSize: PdfPageSize) => {
    setIsPageSizeModalVisible(false);
    handleExportPdf(pageSize);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Chi tiết Nhật ký',
          headerTitleStyle: styles.headerTitleStyle,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
              hitSlop={8}
            >
              <VinaupLeftArrowTwoLayers />
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.rightActions}>
              <Pressable
                style={[
                  styles.actionBtn,
                  (isGeneratingPdf || !cancelLog) && styles.actionBtnDisabled,
                ]}
                onPress={handlePressPdf}
                disabled={isGeneratingPdf || !cancelLog}
              >
                {isGeneratingPdf ? (
                  <ActivityIndicator size="small" color={COLORS.vinaupTeal} />
                ) : (
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={28}
                    color={COLORS.vinaupTeal}
                  />
                )}
              </Pressable>
              <Pressable
                style={[styles.actionBtn, styles.actionBtnDisabled]}
                disabled
              >
                <MaterialCommunityIcons
                  name="microsoft-excel"
                  size={28}
                  color={COLORS.vinaupTeal}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      <PdfPageSizeModal
        visible={isPageSizeModalVisible}
        isLoading={isGeneratingPdf}
        onClose={handleClosePageSizeModal}
        onSelectA4={() => {
          handleSelectPageSize('A4');
        }}
        onSelectA5={() => {
          handleSelectPageSize('A5');
        }}
      />

      {isLoading && !cancelLog && (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="small" color={COLORS.vinaupTeal} />
        </View>
      )}

      {!isLoading && !tourSettlementCancelLogId && (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Thiếu mã nhật ký hủy ký.</Text>
        </View>
      )}

      {!isLoading && tourSettlementCancelLogId && !cancelLog && (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Không tải được dữ liệu nhật ký.</Text>
          <Button style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tải lại</Text>
          </Button>
        </View>
      )}

      {cancelLog && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerTitleRow}>
            <Text style={styles.mainTitle}>Quyết toán</Text>
            <Avatar
              imgSrc={organization?.avatarUrl}
              size={36}
              icon={
                <MaterialIcons name="groups" size={24} color={COLORS.vinaupTeal} />
              }
            />
          </View>
          <View style={styles.subHeaderRow}>
            <Text style={styles.orgName}>{organization?.name || '-'}</Text>
            <Text style={styles.dateText}>
              {formatDateTime(cancelLog.createdAt)}
            </Text>
          </View>

          <View style={styles.thickDivider} />

          <View style={styles.section}>
            <Text style={styles.tourName}>
              Tên: {snapshotTour.tour?.description || '-'}
            </Text>
            <View style={styles.tourSubInfoRow}>
              <Text style={styles.tourTime}>
                Từ {formatDateTime(snapshotTour.tour?.startDate)} đến{' '}
                {formatDateTime(snapshotTour.tour?.endDate)}
              </Text>
              <Text style={styles.tourNo}>No.{snapshotTour.tour?.code || '-'}</Text>
            </View>
          </View>

          <View style={styles.thinDivider} />

          <View style={styles.section}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.summaryHeaderCol1}>
                Tổng (Thực tế) = {totalExpectedCount}
              </Text>
              <Text style={styles.summaryHeaderCol2}>S.lượng</Text>
              <Text style={styles.summaryHeaderCol3}>Giá bán</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.summaryBodyCol1}>Người lớn</Text>
              <Text style={styles.summaryBodyCol2}>
                {Number(snapshotTour.adultTicketCount)}
              </Text>
              <Text style={styles.summaryBodyCol3}>
                {generateLocalePriceFormat(Number(snapshotTour.adultTicketPrice))}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.summaryBodyCol1}>Trẻ em</Text>
              <Text style={styles.summaryBodyCol2}>
                {Number(snapshotTour.childTicketCount)}
              </Text>
              <Text style={styles.summaryBodyCol3}>
                {generateLocalePriceFormat(Number(snapshotTour.childTicketPrice))}
              </Text>
            </View>
          </View>

          <View style={styles.thinDivider} />

          <View style={styles.financialSection}>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Tổng thu</Text>
              <Text style={styles.finValue}>
                {generateLocalePriceFormat(ticketSummary.totalReceipt)}
              </Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Tổng chi</Text>
              <Text style={styles.finValueBold}>
                {generateLocalePriceFormat(ticketSummary.totalPayment)}
              </Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>
                Thuế phải nộp {Number(snapshotTour.taxRate)} %
              </Text>
              <Text style={styles.finValue}>
                {generateLocalePriceFormat(ticketSummary.totalTaxPay)}
              </Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Lợi nhuận sau thuế</Text>
              <Text style={styles.finValue}>
                {generateLocalePriceFormat(ticketSummary.netProfitAfterTaxPay)}
              </Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Tỷ suất lợi nhuận</Text>
              <Text style={styles.finValue}>
                {generateLocalePriceFormat(ticketSummary.profitMarginAfterTaxPay)}%
              </Text>
            </View>
          </View>

          <Text style={styles.detailsTitle}>Chi tiết thu chi</Text>
          <View style={styles.mediumDivider} />

          {groupedReceiptPayments.length === 0 && (
            <Text style={styles.emptyText}>Chưa có dữ liệu thu chi.</Text>
          )}

          {groupedReceiptPayments.map((group) => (
            <View key={group.label}>
              <View style={styles.section}>
                <Text style={styles.dateGroupTitle}>{group.label}</Text>
                <View style={styles.thinDivider} />
                <View style={styles.detailHeaderRow}>
                  <Text style={styles.receiptPaymentHeaderCol1}>Tên nội dung</Text>
                  <Text style={styles.receiptPaymentHeaderCol2}>Đơn giá</Text>
                  <Text style={styles.receiptPaymentHeaderCol3}>SLượng</Text>
                  <Text style={styles.receiptPaymentHeaderCol4}>SLần</Text>
                  <Text style={styles.receiptPaymentHeaderCol5}>Thành tiền</Text>
                </View>
                <View style={styles.thinDivider} />

                {group.items.map((item) => {
                  const total = item.unitPrice * item.quantity * item.frequency;
                  return (
                    <View style={styles.detailRow} key={item.id}>
                      <Text style={styles.receiptPaymentCellCol1} numberOfLines={2}>
                        {item.description || '-'}
                      </Text>
                      <Text style={styles.receiptPaymentCellCol2}>
                        {generateLocalePriceFormat(item.unitPrice)}
                      </Text>
                      <Text style={styles.receiptPaymentCellCol3}>
                        {item.quantity}
                      </Text>
                      <Text style={styles.receiptPaymentCellCol4}>
                        {item.frequency}
                      </Text>
                      <Text style={styles.receiptPaymentCellCol5}>
                        {generateLocalePriceFormat(total)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.thinDivider} />
            </View>
          ))}

          <View style={styles.notesSection}>
            <Feather
              name="message-square"
              size={18}
              color={COLORS.vinaupDarkGray}
            />
            <Text style={styles.noteText}>{snapshotTour.tour?.note || '-'}</Text>
          </View>

          <View style={styles.thinDivider} />

          <View style={styles.partiesSection}>
            <View style={styles.partyCol}>
              <Text style={styles.partyLabel}>Bên bán</Text>
              <Text style={styles.partyValue}>{organization?.name || '-'}</Text>
            </View>
            <View style={styles.partyColRight}>
              <Text style={styles.partyLabel}>Tên đoàn</Text>
              <Text style={styles.partyValueTeal}>{customerName}</Text>
            </View>
          </View>

          <View style={styles.signatureSection}>
            <Text style={styles.signatureTitle}>Ký tên</Text>
            <View style={styles.mediumDivider} />

            <View style={styles.sigRowSpace}>
              <Text style={styles.cancelText}>
                Hủy bởi: {cancelLog.canceledByUser?.name || '-'}
              </Text>
              <Text style={styles.sigDateTextItalic}>
                {formatDateTime(cancelLog.createdAt)}
              </Text>
            </View>

            <View style={styles.thinDivider} />

            {senderSignature && (
              <View style={styles.sigBlock}>
                <View style={styles.sigRowSpace}>
                  <View style={styles.sigRoleWrap}>
                    <VinaupUserArrowUpRight />
                    <Text style={styles.sigRoleItalic}> Tạo:</Text>
                  </View>
                  <Text style={styles.sigDateTextItalic}>
                    {formatDateTime(senderSignature.signedAt || null)}
                  </Text>
                </View>
                <View style={styles.sigRowSpace}>
                  <Text style={styles.sigName}>
                    {senderSignature.targetUser?.name ||
                      senderSignature.targetName ||
                      '-'}
                  </Text>
                  <Text style={styles.sigStatus}>
                    {senderSignature.isSigned ? '(Đã ký)' : '(Chưa ký)'}
                  </Text>
                </View>
              </View>
            )}

            {receiverSignatures.map((receiver) => (
              <View style={styles.sigBlock} key={receiver.id}>
                <View style={styles.sigRowSpace}>
                  <View style={styles.sigRoleWrap}>
                    <VinaupUserChecked />
                    <Text style={styles.sigRoleItalic}> Nhận:</Text>
                  </View>
                  <Text style={styles.sigDateTextItalic}>
                    {formatDateTime(receiver.signedAt || null)}
                  </Text>
                </View>
                <View style={styles.sigRowSpace}>
                  <Text style={styles.sigName}>
                    {receiver.targetUser?.name || receiver.targetName || '-'}
                  </Text>
                  <Text style={styles.sigStatus}>
                    {receiver.isSigned ? '(Đã ký)' : '(Chưa ký)'}
                  </Text>
                </View>
              </View>
            ))}

            {!senderSignature && receiverSignatures.length === 0 && (
              <Text style={styles.emptyText}>Không có dữ liệu ký tên.</Text>
            )}
          </View>
          <View style={styles.footer}>
            <View style={styles.doubleLine} />
            <Text style={styles.footerText}>
              VinaUp.com (Ứng dụng thu chi & quản lý)
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.vinaupWhite,
    paddingTop: 12,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
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
  headerTitleStyle: {
    fontSize: 18,
  },
  backBtn: {
    padding: 4,
    marginLeft: -8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 40,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.vinaupTeal,
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orgName: {
    fontSize: 16,
    color: COLORS.vinaupBlackLaminated,
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
  },
  thickDivider: {
    height: 4,
    backgroundColor: COLORS.vinaupTeal,
    marginVertical: 8,
  },
  mediumDivider: {
    height: 2,
    backgroundColor: COLORS.vinaupTeal,
    marginVertical: 8,
  },
  thinDivider: {
    height: 1,
    backgroundColor: COLORS.vinaupLightGray,
    marginVertical: 8,
  },
  section: {
    paddingVertical: 4,
  },
  tourName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.vinaupBlackLaminated,
    marginBottom: 4,
  },
  tourSubInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tourTime: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    fontStyle: 'italic',
    flex: 1,
  },
  tourNo: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryHeaderCol1: {
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
    fontWeight: '500',
    flex: 2,
    textAlign: 'left',
  },
  summaryHeaderCol2: {
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  summaryHeaderCol3: {
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryBodyCol1: {
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
    flex: 2,
  },
  summaryBodyCol2: {
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
    flex: 1,
    textAlign: 'right',
  },
  summaryBodyCol3: {
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
    flex: 1.5,
    textAlign: 'right',
  },
  financialSection: {
    paddingVertical: 4,
    gap: 4,
  },
  finRow: {
    flexDirection: 'row',
  },
  finLabel: {
    flex: 3,
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    textAlign: 'right',
  },
  finValue: {
    flex: 1.5,
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'right',
  },
  finValueBold: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'right',
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.vinaupBlackLaminated,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
    marginBottom: 8,
  },
  dateGroupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.vinaupBlackLaminated,
  },
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  receiptPaymentHeaderCol1: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 2,
  },
  receiptPaymentHeaderCol2: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 1.2,
    textAlign: 'center',
  },
  receiptPaymentHeaderCol3: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 1.1,
    textAlign: 'center',
  },
  receiptPaymentHeaderCol4: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 1.1,
    textAlign: 'center',
  },
  receiptPaymentHeaderCol5: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 1.5,
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  receiptPaymentCellCol1: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 2,
  },
  receiptPaymentCellCol2: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 1.1,
    textAlign: 'center',
  },
  receiptPaymentCellCol3: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 1.1,
    textAlign: 'center',
  },
  receiptPaymentCellCol4: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 1.1,
    textAlign: 'center',
  },
  receiptPaymentCellCol5: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    flex: 1.5,
    textAlign: 'right',
  },
  notesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
    flex: 1,
  },
  partiesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginBottom: 8,
  },
  partyCol: {
    gap: 4,
    flex: 1,
  },
  partyColRight: {
    gap: 4,
    alignItems: 'flex-end',
    flex: 1,
  },
  partyLabel: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    textDecorationLine: 'underline',
  },
  partyValue: {
    fontSize: 15,
    color: COLORS.vinaupBlackLaminated,
  },
  partyValueTeal: {
    fontSize: 15,
    color: COLORS.vinaupTeal,
  },
  signatureSection: {
    paddingVertical: 4,
  },
  signatureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.vinaupBlackLaminated,
  },
  cancelText: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    flex: 1,
  },
  sigBlock: {
    marginBottom: 12,
  },
  sigRowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  sigRoleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sigRoleItalic: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.vinaupBlackLaminated,
  },
  sigDateTextItalic: {
    fontSize: 14,
    color: COLORS.vinaupMediumGray,
    fontStyle: 'italic',
  },
  sigName: {
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
    flex: 1,
  },
  sigStatus: {
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
  },
  footer: {
    backgroundColor: COLORS.vinaupWhite,
  },
  doubleLine: {
    height: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.vinaupBlackLaminated,
    marginBottom: 8,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.vinaupMediumDarkGray,
  },
});
