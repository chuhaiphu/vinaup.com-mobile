import { DATE_FORMAT_SHORT } from '@/constants/app-constant';
import { getBookingByIdApi } from '@/apis/booking-apis';
import { getSignaturesByDocumentIdApi } from '@/apis/signature-apis';
import VinaupLeftArrowTwoLayers from '@/components/icons/vinaup-left-arrow-two-layers.native';
import VinaupUserArrowUpRight from '@/components/icons/vinaup-user-arrow-up-right.native';
import VinaupUserChecked from '@/components/icons/vinaup-user-checked.native';
import VinaupSigningPen from '@/components/icons/vinaup-signing-pen.native';
import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';
import { RECEIPT_PAYMENT_TYPES } from '@/constants/receipt-payment-constants';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useFetchFn } from 'fetchwire';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function formatDateTime(value?: string | Date | null): string {
  if (!value) return '-';
  const d = dayjs(value);
  if (!d.isValid()) return '-';
  return d.format('DD/MM HH:mm');
}

export default function BookingDetailPreview() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  const {
    data: bookingWithMeta,
    isLoading: isLoadingBooking,
    executeFetchFn: fetchBooking,
  } = useFetchFn(() => getBookingByIdApi(bookingId || ''), {
    fetchKey: `organization-booking-${bookingId}`,
  });

  const {
    data: signatures,
    isLoading: isLoadingSignatures,
    executeFetchFn: fetchSignatures,
  } = useFetchFn(() => getSignaturesByDocumentIdApi(bookingId || ''), {
    fetchKey: `signature-list-in-booking-${bookingId}`,
  });

  useEffect(() => {
    if (!bookingId) return;
    fetchBooking();
    fetchSignatures();
  }, [bookingId, fetchBooking, fetchSignatures]);

  const booking = bookingWithMeta;
  const isLoading = isLoadingBooking || isLoadingSignatures;

  const receiptPayments: ReceiptPaymentResponse[] = booking?.receiptPayments ?? [];

  const groupedReceiptPayments = (() => {
    const groups = new Map<string, ReceiptPaymentResponse[]>();
    receiptPayments.forEach((item) => {
      const label = dayjs(item.transactionDate).isValid()
        ? dayjs(item.transactionDate).format(DATE_FORMAT_SHORT)
        : '-';
      const current = groups.get(label) || [];
      groups.set(label, [...current, item]);
    });
    return Array.from(groups.entries())
      .map(([label, items]) => ({
        label,
        items,
        sortTimestamp: dayjs(items[0]?.transactionDate).valueOf() || 0,
      }))
      .sort((a, b) => b.sortTimestamp - a.sortTimestamp);
  })();

  const totalReceipt = receiptPayments
    .filter((p) => p.type === RECEIPT_PAYMENT_TYPES.RECEIPT)
    .reduce((sum, p) => sum + p.unitPrice * p.quantity * p.frequency, 0);

  const totalPayment = receiptPayments
    .filter((p) => p.type === RECEIPT_PAYMENT_TYPES.PAYMENT)
    .reduce((sum, p) => sum + p.unitPrice * p.quantity * p.frequency, 0);

  const balance = totalReceipt - totalPayment;

  const senderSignature = signatures?.find((s) => s.signatureRole === 'SENDER');
  const receiverSignature = signatures?.find((s) => s.signatureRole === 'RECEIVER');

  const customerName = booking?.organizationCustomer?.name || '-';

  const handleRetry = () => {
    if (!bookingId) return;
    fetchBooking();
    fetchSignatures();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Xem trước Booking',
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
                style={[styles.actionBtn, styles.actionBtnDisabled]}
                disabled
              >
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={28}
                  color={COLORS.vinaupTeal}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      {isLoading && !booking && (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="small" color={COLORS.vinaupTeal} />
        </View>
      )}

      {!isLoading && !bookingId && (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Thiếu mã booking.</Text>
        </View>
      )}

      {!isLoading && bookingId && !booking && (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Không tải được dữ liệu booking.</Text>
          <Button style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tải lại</Text>
          </Button>
        </View>
      )}

      {booking && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Header box ── */}
          <View style={styles.headerBox}>
            <Text style={styles.bookingName}>{booking.description || '-'}</Text>
            <View style={styles.headerSubRow}>
              <Text style={styles.headerMeta} numberOfLines={1}>
                Từ: {formatDateTime(booking.startDate)}
                {'  '}Đến: {formatDateTime(booking.endDate)}
              </Text>
              <Text style={styles.bookingCode}>No.{booking.code || '-'}</Text>
            </View>
            {customerName !== '-' && (
              <Text style={styles.customerLine}>Khách hàng: {customerName}</Text>
            )}
          </View>

          {/* ── Table ── */}
          <View style={styles.tableContainer}>
            {groupedReceiptPayments.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có dữ liệu thu chi.</Text>
            ) : (
              <>
                <View style={styles.tableHead}>
                  <Text style={styles.thCol1}>Nội dung</Text>
                  <Text style={styles.thCol2}>Đơn giá</Text>
                  <Text style={styles.thCol3}>SL</Text>
                  <Text style={styles.thCol4}>Lần</Text>
                  <Text style={styles.thCol5}>Thành tiền</Text>
                </View>
                <View style={styles.thinDivider} />

                {groupedReceiptPayments.map((group) => (
                  <View key={group.label}>
                    <Text style={styles.groupDate}>{group.label}</Text>
                    {group.items.map((item) => {
                      const total = item.unitPrice * item.quantity * item.frequency;
                      return (
                        <View key={item.id} style={styles.tableRow}>
                          <Text style={styles.tdCol1} numberOfLines={2}>
                            {item.description || '-'}
                          </Text>
                          <Text style={styles.tdCol2}>
                            {generateLocalePriceFormat(item.unitPrice)}
                          </Text>
                          <Text style={styles.tdCol3}>{item.quantity}</Text>
                          <Text style={styles.tdCol4}>{item.frequency}</Text>
                          <Text style={styles.tdCol5}>
                            {generateLocalePriceFormat(total)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </>
            )}
          </View>

          {/* ── Summary ── */}
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Tổng thu</Text>
            <Text style={styles.finValue}>
              {generateLocalePriceFormat(totalReceipt)}
            </Text>
          </View>
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Tổng chi</Text>
            <Text style={styles.finValue}>
              {generateLocalePriceFormat(totalPayment)}
            </Text>
          </View>
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Số dư</Text>
            <Text style={[styles.finValue, balance < 0 && styles.colorNegative]}>
              {generateLocalePriceFormat(balance)}
            </Text>
          </View>

          {/* ── Ghi chú ── */}
          {!!booking.note && (
            <>
              <View style={styles.thinDivider} />
              <View style={styles.noteRow}>
                <Feather
                  name="message-square"
                  size={14}
                  color={COLORS.vinaupMediumGray}
                />
                <Text style={styles.noteText}>{booking.note}</Text>
              </View>
            </>
          )}

          <View style={styles.thinDivider} />

          {/* ── Parties ── */}
          <View style={styles.partiesBox}>
            <View style={styles.partyLeft}>
              <View style={styles.partyRoleRow}>
                <VinaupUserArrowUpRight />
                <Text style={styles.partyRoleText}> Bên tạo</Text>
              </View>
              <Text style={styles.partyName}>
                {booking.organization?.name || '-'}
              </Text>
            </View>
            <View style={styles.partyRight}>
              <View style={[styles.partyRoleRow, { justifyContent: 'flex-end' }]}>
                <Text style={styles.partyRoleText}>Bên nhận </Text>
                <VinaupUserChecked />
              </View>
              <Text style={[styles.partyName, { textAlign: 'right' }]}>
                {customerName}
              </Text>
            </View>
          </View>

          {/* ── Signatures ── */}
          {(senderSignature || receiverSignature) && (
            <View style={styles.sigRow}>
              <View style={styles.sigCol}>
                {senderSignature && (
                  <>
                    <View style={styles.sigStatusRow}>
                      <VinaupSigningPen
                        width={16}
                        height={15}
                        color={
                          senderSignature.isSigned
                            ? COLORS.vinaupOrange
                            : COLORS.vinaupMediumGray
                        }
                      />
                      <Text
                        style={[
                          styles.sigStatusText,
                          {
                            color: senderSignature.isSigned
                              ? COLORS.vinaupOrange
                              : COLORS.vinaupMediumGray,
                          },
                        ]}
                      >
                        {senderSignature.isSigned ? ' Đã ký' : ' Chờ ký'}
                      </Text>
                    </View>
                    <Text style={styles.sigName}>
                      {senderSignature.targetUser?.name ||
                        senderSignature.targetName ||
                        '-'}
                    </Text>
                    <Text style={styles.sigDate}>
                      {formatDateTime(senderSignature.signedAt ?? null)}
                    </Text>
                  </>
                )}
              </View>

              <View style={[styles.sigCol, { alignItems: 'flex-end' }]}>
                {receiverSignature && (
                  <>
                    <View style={styles.sigStatusRow}>
                      <Text
                        style={[
                          styles.sigStatusText,
                          {
                            color: receiverSignature.isSigned
                              ? COLORS.vinaupOrange
                              : COLORS.vinaupTeal,
                          },
                        ]}
                      >
                        {receiverSignature.isSigned ? 'Đã ký' : 'Chờ ký'}
                      </Text>
                      <VinaupSigningPen
                        width={16}
                        height={15}
                        color={
                          receiverSignature.isSigned
                            ? COLORS.vinaupOrange
                            : COLORS.vinaupTeal
                        }
                      />
                    </View>
                    <Text style={[styles.sigName, { textAlign: 'right' }]}>
                      {receiverSignature.signedByUser?.name ||
                        receiverSignature.targetName ||
                        '-'}
                    </Text>
                    <Text style={[styles.sigDate, { textAlign: 'right' }]}>
                      {formatDateTime(receiverSignature.signedAt ?? null)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}

          {!senderSignature && !receiverSignature && (
            <Text style={styles.emptyText}>Không có dữ liệu ký tên.</Text>
          )}

          {/* ── Footer ── */}
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
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
  },
  retryButtonText: {
    fontSize: 14,
    color: COLORS.vinaupTeal,
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
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 40,
  },

  // ── Header box ──
  headerBox: {
    backgroundColor: COLORS.vinaupSoftGray,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.vinaupBlackLaminated,
  },
  headerSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  headerMeta: {
    flex: 1,
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.vinaupMediumDarkGray,
  },
  bookingCode: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.vinaupMediumDarkGray,
  },
  customerLine: {
    fontSize: 13,
    color: COLORS.vinaupMediumDarkGray,
  },

  // ── Dividers ──
  thinDivider: {
    height: 1,
    backgroundColor: COLORS.vinaupLightGray,
    marginVertical: 8,
  },

  // ── Table ──
  tableContainer: {
    marginVertical: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.vinaupLightGray,
  },
  tableHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  thCol1: {
    flex: 2.2,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
  },
  thCol2: {
    flex: 1.4,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'center',
  },
  thCol3: {
    flex: 0.7,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'center',
  },
  thCol4: {
    flex: 0.7,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'center',
  },
  thCol5: {
    flex: 1.5,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'right',
  },
  groupDate: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.vinaupMediumGray,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupLightGray,
  },
  tdCol1: {
    flex: 2.2,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    lineHeight: 18,
  },
  tdCol2: {
    flex: 1.4,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'center',
  },
  tdCol3: {
    flex: 0.7,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'center',
  },
  tdCol4: {
    flex: 0.7,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'center',
  },
  tdCol5: {
    flex: 1.5,
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'right',
  },

  // ── Summary ──
  finRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  finLabel: {
    flex: 3,
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    textAlign: 'right',
    paddingRight: 12,
  },
  finValue: {
    flex: 1.5,
    fontSize: 14,
    color: COLORS.vinaupBlackLaminated,
    textAlign: 'right',
  },
  colorNegative: {
    color: COLORS.vinaupOrange,
  },

  // ── Note ──
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingVertical: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.vinaupMediumGray,
    lineHeight: 18,
  },

  // ── Parties ──
  partiesBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.vinaupSoftGray,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  partyLeft: {
    flex: 1,
    gap: 4,
  },
  partyRight: {
    flex: 1,
    gap: 4,
  },
  partyRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partyRoleText: {
    fontSize: 13,
    color: COLORS.vinaupDarkGray,
  },
  partyName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.vinaupBlackLaminated,
  },

  // ── Signatures ──
  sigRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  sigCol: {
    flex: 1,
    gap: 2,
  },
  sigStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sigStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sigName: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
  },
  sigDate: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.vinaupMediumGray,
  },

  // ── Footer ──
  footer: {
    marginTop: 4,
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
    fontSize: 12,
    color: COLORS.vinaupMediumDarkGray,
  },

  emptyText: {
    fontSize: 13,
    color: COLORS.vinaupMediumGray,
    marginBottom: 8,
  },
});
