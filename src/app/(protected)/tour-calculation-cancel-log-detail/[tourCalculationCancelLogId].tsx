import { DD_MM_DATE_FORMAT_SHORT } from '@/constants/app-constant';
import { getTourCalculationCancelLogByIdApi } from '@/apis/tour/tour-calculation';
import VinaupLeftArrowTwoLayers from '@/components/icons/vinaup-left-arrow-two-layers.native';
import VinaupUserArrowUpRight from '@/components/icons/vinaup-user-arrow-up-right.native';
import VinaupUserChecked from '@/components/icons/vinaup-user-checked.native';
import { PdfPageSizeModal } from '@/components/commons/modals/pdf-page-size-modal/pdf-page-size-modal';
import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';
import { TourCalculationCancelLogSnapshot } from '@/interfaces/tour-calculation-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { SignatureResponse } from '@/interfaces/signature-interfaces';
import { calculateTourTicketSummaries } from '@/utils/calculator/calculate-tour-ticket-summaries';
import { generateFormatDateTime } from '@/utils/generator/string-generator/generate-format-date-time';
import { generateLocalePriceFormat } from '@/utils/generator/string-generator/generate-locale-price-format';
import { createAndShareTourCalculationCancelLogPdf } from '@/utils/generator/file-generator/pdf/create-and-share-tour-calculation-cancel-log-pdf';
import type { PdfPageSize } from '@/utils/generator/file-generator/html/generate-tour-cancel-log-html';
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
import { getOrganizationByIdApi } from '@/apis/organization/organization';
import { Avatar } from '@/components/primitives/avatar';


export default function TourCalculationCancelLogDetail() {
  const router = useRouter();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPageSizeModalVisible, setIsPageSizeModalVisible] = useState(false);
  const { tourCalculationCancelLogId, organizationId } = useLocalSearchParams<{
    tourCalculationCancelLogId?: string;
    organizationId?: string;
  }>();

  const {
    data: cancelLog,
    isLoading,
    executeFetchFn: fetchCancelLog,
  } = useFetchFn(
    () => getTourCalculationCancelLogByIdApi(tourCalculationCancelLogId || ''),
    {
      fetchKey: `tour-calculation-cancel-log-${tourCalculationCancelLogId}`,
      tags: ['tour-calculation-cancel-log-detail'],
    }
  );

  const { data: organization, executeFetchFn: fetchOrganization } = useFetchFn(
    () => getOrganizationByIdApi(organizationId || ''),
    { fetchKey: `organization-${organizationId}` }
  );

  useEffect(() => {
    if (!tourCalculationCancelLogId) {
      return;
    }
    fetchCancelLog();
    fetchOrganization();
  }, [tourCalculationCancelLogId, fetchCancelLog, fetchOrganization]);

  const snapshotCalculation: TourCalculationCancelLogSnapshot =
    cancelLog?.snapshotData?.tourCalculation ?? {};
  const snapshotSignatures: SignatureResponse[] =
    cancelLog?.snapshotData?.signatures ?? [];

  const receiptPayments = snapshotCalculation.receiptPayments ?? [];

  const ticketSummary = calculateTourTicketSummaries(receiptPayments, {
    adultTicketCount: Number(snapshotCalculation.adultTicketCount),
    childTicketCount: Number(snapshotCalculation.childTicketCount),
    adultTicketPrice: Number(snapshotCalculation.adultTicketPrice),
    childTicketPrice: Number(snapshotCalculation.childTicketPrice),
    taxRate: Number(snapshotCalculation.taxRate),
  });

  const groupedReceiptPayments = (() => {
    const groups = new Map<string, ReceiptPaymentResponse[]>();

    // Create transaction date label groups (day/month)
    receiptPayments.forEach((item) => {
      const groupLabel = dayjs(item.transactionDate).isValid()
        ? dayjs(item.transactionDate).format(DD_MM_DATE_FORMAT_SHORT)
        : '-';

      const current = groups.get(groupLabel) || [];
      groups.set(groupLabel, [...current, item]);
    });

    // Convert from Map<string, ReceiptPaymentResponse[]>
    // Map(2) {
    //   "25/03" => ReceiptPaymentResponse[],
    //   "26/03" => ReceiptPaymentResponse[]
    // }
    // to
    // MapIterator {
    //   ["25/03", ReceiptPaymentResponse[]], // Cặp [key, value] thứ nhất
    //   ["26/03", ReceiptPaymentResponse[]]  // Cặp [key, value] thứ hai
    // }
    const groupIterators = groups.entries();

    // Convert MapIterator to array so that we can map and sort it
    // from MapIterator
    // to
    // [
    //   ["25/03", ReceiptPaymentResponse[]],
    //   ["26/03", ReceiptPaymentResponse[]]
    // ]
    const groupIteratorArray = Array.from(groupIterators);

    return groupIteratorArray
      .map(([label, items]) => ({
        label,
        items,
        sortTimestamp: dayjs(items[0]?.transactionDate).valueOf() || 0,
      }))
      .sort((a, b) => b.sortTimestamp - a.sortTimestamp);
  })();

  const senderSignature = snapshotSignatures.find(
    (signature) => signature.signatureRole === 'SENDER'
  );

  const receiverSignatures = snapshotSignatures.filter(
    (signature) => signature.signatureRole === 'RECEIVER'
  );

  const customerName = snapshotCalculation.tour?.externalCustomerName || '-';

  const totalExpectedCount =
    Number(snapshotCalculation.adultTicketCount) + Number(snapshotCalculation.childTicketCount);

  const handleRetry = () => {
    if (!tourCalculationCancelLogId) {
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

      await createAndShareTourCalculationCancelLogPdf({
        cancelLog,
        organization: organization || undefined,
        tourCancelLogSnapshot: snapshotCalculation,
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

      {!isLoading && !tourCalculationCancelLogId && (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Thiếu mã nhật ký hủy ký.</Text>
        </View>
      )}

      {!isLoading && tourCalculationCancelLogId && !cancelLog && (
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
            <Text style={styles.mainTitle}>Tính giá</Text>
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
              {generateFormatDateTime(cancelLog.createdAt)}
            </Text>
          </View>

          <View style={styles.thickDivider} />

          <View style={styles.section}>
            <Text style={styles.tourName}>
              Tên: {snapshotCalculation.tour?.description || '-'}
            </Text>
            <View style={styles.tourSubInfoRow}>
              <Text style={styles.tourTime}>
                Từ {generateFormatDateTime(snapshotCalculation.tour?.startDate ?? null)} đến{' '}
                {generateFormatDateTime(snapshotCalculation.tour?.endDate ?? null)}
              </Text>
              <Text style={styles.tourNo}>No.{snapshotCalculation.tour?.code || '-'}</Text>
            </View>
          </View>

          <View style={styles.thinDivider} />

          <View style={styles.section}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.summaryHeaderCol1}>
                Tổng (Dự kiến) = {totalExpectedCount}
              </Text>
              <Text style={styles.summaryHeaderCol2}>S.lượng</Text>
              <Text style={styles.summaryHeaderCol3}>Giá bán</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.summaryBodyCol1}>Người lớn</Text>
              <Text style={styles.summaryBodyCol2}>
                {Number(snapshotCalculation.adultTicketCount)}
              </Text>
              <Text style={styles.summaryBodyCol3}>
                {generateLocalePriceFormat(Number(snapshotCalculation.adultTicketPrice))}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.summaryBodyCol1}>Trẻ em</Text>
              <Text style={styles.summaryBodyCol2}>
                {Number(snapshotCalculation.childTicketCount)}
              </Text>
              <Text style={styles.summaryBodyCol3}>
                {generateLocalePriceFormat(Number(snapshotCalculation.childTicketPrice))}
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
                Thuế phải nộp {Number(snapshotCalculation.taxRate)} %
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
            <Text style={styles.noteText}>{snapshotCalculation.tour?.note || '-'}</Text>
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
                {generateFormatDateTime(cancelLog.createdAt)}
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
                    {generateFormatDateTime(senderSignature.signedAt || null)}
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
                    {generateFormatDateTime(receiver.signedAt || null)}
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
  actionTextTeal: {
    fontSize: 13,
    color: COLORS.vinaupTeal,
    fontWeight: '500',
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
