import { getBookingByIdApi } from '@/apis/booking-apis';
import { getSignaturesByDocumentIdApi } from '@/apis/signature-apis';
import VinaupLeftArrowTwoLayers from '@/components/icons/vinaup-left-arrow-two-layers.native';
import VinaupUserArrowUpRight from '@/components/icons/vinaup-user-arrow-up-right.native';
import VinaupUserChecked from '@/components/icons/vinaup-user-checked.native';
import { Avatar } from '@/components/primitives/avatar';
import { Button } from '@/components/primitives/button';
import { COLORS } from '@/constants/style-constant';
import { RECEIPT_PAYMENT_TYPES } from '@/constants/receipt-payment-constants';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { generateLocalePriceFormat } from '@/utils/generator-helpers';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
  const formatted = dayjs(value);
  if (!formatted.isValid()) return '-';
  return formatted.format('DD/MM HH:mm');
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
        ? dayjs(item.transactionDate).format('DD/MM')
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
  const receiverSignatures =
    signatures?.filter((s) => s.signatureRole === 'RECEIVER') ?? [];

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
          {/* Header title row */}
          <View style={styles.headerTitleRow}>
            <Text style={styles.mainTitle}>Booking</Text>
            <Avatar
              imgSrc={booking.organization?.avatarUrl}
              size={36}
              icon={
                <MaterialIcons name="groups" size={24} color={COLORS.vinaupTeal} />
              }
            />
          </View>
          <View style={styles.subHeaderRow}>
            <Text style={styles.orgName}>{booking.organization?.name || '-'}</Text>
            <Text style={styles.dateText}>{formatDateTime(booking.createdAt)}</Text>
          </View>

          <View style={styles.thickDivider} />

          {/* Booking info section */}
          <View style={styles.section}>
            <Text style={styles.bookingName}>
              Tên: {booking.description || '-'}
            </Text>
            <View style={styles.bookingSubInfoRow}>
              <Text style={styles.bookingTime}>
                Từ {formatDateTime(booking.startDate)} đến{' '}
                {formatDateTime(booking.endDate)}
              </Text>
              <Text style={styles.bookingCode}>No.{booking.code || '-'}</Text>
            </View>
            {customerName !== '-' && (
              <Text style={styles.customerName}>Khách hàng: {customerName}</Text>
            )}
          </View>

          <View style={styles.thinDivider} />

          {/* Receipt payments table */}
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

          {/* Financial summary */}
          <View style={styles.financialSection}>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Tổng thu</Text>
              <Text style={styles.finValue}>
                {generateLocalePriceFormat(totalReceipt)}
              </Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Tổng chi</Text>
              <Text style={styles.finValueBold}>
                {generateLocalePriceFormat(totalPayment)}
              </Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Số dư</Text>
              <Text
                style={[styles.finValue, balance < 0 && styles.finValueNegative]}
              >
                {generateLocalePriceFormat(balance)}
              </Text>
            </View>
          </View>

          {/* Note */}
          <View style={styles.thinDivider} />
          <View style={styles.notesSection}>
            <Feather
              name="message-square"
              size={18}
              color={COLORS.vinaupDarkGray}
            />
            <Text style={styles.noteText}>{booking.note || '-'}</Text>
          </View>

          <View style={styles.thinDivider} />

          {/* Parties section */}
          <View style={styles.partiesSection}>
            <View style={styles.partyCol}>
              <Text style={styles.partyLabel}>Bên tạo</Text>
              <Text style={styles.partyValue}>
                {booking.organization?.name || '-'}
              </Text>
            </View>
            <View style={styles.partyColRight}>
              <Text style={styles.partyLabel}>Khách hàng</Text>
              <Text style={styles.partyValueTeal}>{customerName}</Text>
            </View>
          </View>

          {/* Signature section */}
          <View style={styles.signatureSection}>
            <Text style={styles.signatureTitle}>Ký tên</Text>
            <View style={styles.mediumDivider} />

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

          {/* Footer */}
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
  bookingName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.vinaupBlackLaminated,
    marginBottom: 4,
  },
  bookingSubInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingTime: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    fontStyle: 'italic',
    flex: 1,
  },
  bookingCode: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  customerName: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    marginTop: 4,
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
  finValueNegative: {
    color: COLORS.vinaupOrange,
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
