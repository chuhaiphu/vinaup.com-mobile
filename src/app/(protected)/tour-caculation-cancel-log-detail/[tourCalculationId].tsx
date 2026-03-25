import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from '@/constants/style-constant';
import VinaupUserChecked from '@/components/icons/vinaup-user-checked.native';
import VinaupUserArrowUpRight from '@/components/icons/vinaup-user-arrow-up-right.native';
import VinaupLeftArrowTwoLayers from '@/components/icons/vinaup-left-arrow-two-layers.native';

interface TourCalculationCancelLogDetailProps {
  onBackPress?: () => void;
}

export default function TourCalculationCancelLogDetail({
  onBackPress,
}: TourCalculationCancelLogDetailProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header Bar */}
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
              <Pressable style={styles.actionBtn}>
                <Feather name="share-2" size={18} color={COLORS.vinaupTeal} />
                <Text style={styles.actionTextTeal}>PDF</Text>
              </Pressable>
              <Pressable style={styles.actionBtn}>
                <Feather name="mail" size={18} color={COLORS.vinaupTeal} />
                <Text style={styles.actionTextTeal}>Excel</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Title Section */}
        <View style={styles.headerTitleRow}>
          <Text style={styles.mainTitle}>Tính giá</Text>
          <View style={styles.iconCircle}>
            <Feather name="users" size={20} color={COLORS.vinaupTeal} />
          </View>
        </View>
        <View style={styles.subHeaderRow}>
          <Text style={styles.orgName}>Cty cửa hàng ABC</Text>
          <Text style={styles.dateText}>23/03/26 13:56</Text>
        </View>

        <View style={styles.thickDivider} />

        {/* Tour Info Section */}
        <View style={styles.section}>
          <Text style={styles.tourName}>Tên: Tiêu đề & thời gian</Text>
          <View style={styles.tourSubInfoRow}>
            <Text style={styles.tourTime}>Từ 16/10 (08:00) đến 18/10/26</Text>
            <Text style={styles.tourNo}>No.92792282</Text>
          </View>
        </View>

        <View style={styles.thinDivider} />

        {/* Expected Summary */}
        <View style={styles.section}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.summaryHeaderCol1}>Tổng (Dự kiến) = 14</Text>
            <Text style={styles.summaryHeaderCol2}>S.lượng</Text>
            <Text style={styles.summaryHeaderCol3}>Giá bán</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.summaryBodyCol1}>Người lớn</Text>
            <Text style={styles.summaryBodyCol2}>12</Text>
            <Text style={styles.summaryBodyCol3}>250.000.000</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.summaryBodyCol1}>Trẻ em</Text>
            <Text style={styles.summaryBodyCol2}>2</Text>
            <Text style={styles.summaryBodyCol3}>12.000.000</Text>
          </View>
        </View>

        <View style={styles.thinDivider} />

        {/* Financial Summary */}
        <View style={styles.financialSection}>
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Tổng thu</Text>
            <Text style={styles.finValue}>10.000.000</Text>
          </View>
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Tổng chi</Text>
            <Text style={styles.finValueBold}>12.000.000</Text>
          </View>
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Thuế phải nộp 10 %</Text>
            <Text style={styles.finValue}>0</Text>
          </View>
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Lợi nhuận sau thuế</Text>
            <Text style={styles.finValue}>1.020.000</Text>
          </View>
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Tỷ suất lợi nhuận</Text>
            <Text style={styles.finValue}>35%</Text>
          </View>
        </View>

        {/* Details Title */}
        <Text style={styles.detailsTitle}>Chi tiết thu chi</Text>
        <View style={styles.mediumDivider} />

        {/* 18/10 Group */}
        <View style={styles.section}>
          <Text style={styles.dateGroupTitle}>18/10</Text>
          <View style={styles.thinDivider} />
          <View style={styles.detailHeaderRow}>
            <Text style={styles.receiptPaymentHeaderCol1}>Tên nội dung</Text>
            <Text style={styles.receiptPaymentHeaderCol2}>Đơn giá</Text>
            <Text style={styles.receiptPaymentHeaderCol3}>SLượng</Text>
            <Text style={styles.receiptPaymentHeaderCol4}>SLần</Text>
            <Text style={styles.receiptPaymentHeaderCol5}>Thành tiền</Text>
          </View>
          <View style={styles.thinDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.receiptPaymentCellCol1} numberOfLines={2}>
              Tên nội dung dài đến đây ..
            </Text>
            <Text style={styles.receiptPaymentCellCol2}>250.000</Text>
            <Text style={styles.receiptPaymentCellCol3}>01</Text>
            <Text style={styles.receiptPaymentCellCol4}>01</Text>
            <Text style={styles.receiptPaymentCellCol5}>250.000.000</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.receiptPaymentCellCol1} numberOfLines={2}>
              Tên nội dung dài đến đây ..
            </Text>
            <Text style={styles.receiptPaymentCellCol2}>250.000</Text>
            <Text style={styles.receiptPaymentCellCol3}>01</Text>
            <Text style={styles.receiptPaymentCellCol4}>01</Text>
            <Text style={styles.receiptPaymentCellCol5}>250.000.000</Text>
          </View>
        </View>

        <View style={styles.thinDivider} />

        {/* 17/10 Group */}
        <View style={styles.section}>
          <Text style={styles.dateGroupTitle}>17/10</Text>
          <View style={styles.thinDivider} />
          <View style={styles.detailHeaderRow}>
            <Text style={styles.receiptPaymentHeaderCol1}>Tên nội dung</Text>
            <Text style={styles.receiptPaymentHeaderCol2}>Đơn giá</Text>
            <Text style={styles.receiptPaymentHeaderCol3}>SLượng</Text>
            <Text style={styles.receiptPaymentHeaderCol4}>SLần</Text>
            <Text style={styles.receiptPaymentHeaderCol5}>Thành tiền</Text>
          </View>
          <View style={styles.thinDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.receiptPaymentCellCol1} numberOfLines={2}>
              Tên nội dung dài đến đây ..
            </Text>
            <Text style={styles.receiptPaymentCellCol2}>250.000</Text>
            <Text style={styles.receiptPaymentCellCol3}>01</Text>
            <Text style={styles.receiptPaymentCellCol4}>01</Text>
            <Text style={styles.receiptPaymentCellCol5}>250.000.000</Text>
          </View>
        </View>

        <View style={styles.thinDivider} />

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Feather name="message-square" size={18} color={COLORS.vinaupDarkGray} />
          <Text style={styles.noteText}>nội dung ghi chú</Text>
        </View>

        <View style={styles.thinDivider} />

        {/* Parties Section */}
        <View style={styles.partiesSection}>
          <View style={styles.partyCol}>
            <Text style={styles.partyLabel}>Bên bán</Text>
            <Text style={styles.partyValue}>Tên tổ chức ABC</Text>
          </View>
          <View style={styles.partyColRight}>
            <Text style={styles.partyLabel}>Tên đoàn</Text>
            <Text style={styles.partyValueTeal}>Khách lẻ</Text>
          </View>
        </View>

        {/* Signatures Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureTitle}>Ký tên</Text>
          <View style={styles.mediumDivider} />

          <View style={styles.sigRowSpace}>
            <Text style={styles.cancelText}>Hủy bởi: Nguyễn Văn Tèo Em</Text>
            <Text style={styles.sigDateTextItalic}>3/12/26 12:35</Text>
          </View>

          <View style={styles.thinDivider} />

          <View style={styles.sigBlock}>
            <View style={styles.sigRowSpace}>
              <View style={styles.sigRoleWrap}>
                <VinaupUserArrowUpRight />
                <Text style={styles.sigRoleItalic}> Tạo:</Text>
              </View>
              <Text style={styles.sigDateTextItalic}>3/12/26 12:35</Text>
            </View>
            <View style={styles.sigRowSpace}>
              <Text style={styles.sigName}>Nguyễn Văn Tèo Em</Text>
              <Text style={styles.sigStatus}>(Đã ký)</Text>
            </View>
          </View>

          <View style={styles.sigBlock}>
            <View style={styles.sigRowSpace}>
              <View style={styles.sigRoleWrap}>
                <VinaupUserChecked />
                <Text style={styles.sigRoleItalic}> Nhận:</Text>
              </View>
            </View>
            <View style={styles.sigRowSpace}>
              <Text style={styles.sigName}>Nguyễn Văn Tèo Chị</Text>
            </View>
          </View>

          <View style={styles.sigBlock}>
            <View style={styles.sigRowSpace}>
              <View style={styles.sigRoleWrap}>
                <VinaupUserChecked />
                <Text style={styles.sigRoleItalic}> Nhận:</Text>
              </View>
              <Text style={styles.sigDateTextItalic}>3/12/26 12:35</Text>
            </View>
            <View style={styles.sigRowSpace}>
              <Text style={styles.sigName}>Nguyễn Văn Tèo Anh</Text>
              <Text style={styles.sigStatus}>(Đã ký)</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.doubleLine} />
          <Text style={styles.footerText}>
            VinaUp.com (Ứng dụng thu chi & quản lý)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.vinaupWhite,
    paddingTop: 12,
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
  actionText: {
    fontSize: 13,
    color: COLORS.vinaupBlackLaminated,
    fontWeight: '500',
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
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orgName: {
    fontSize: 16,
    color: COLORS.vinaupBlackLaminated,
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
  },
  tourNo: {
    fontSize: 14,
    color: COLORS.vinaupMediumDarkGray,
    fontStyle: 'italic',
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
  },
  partiesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginBottom: 8,
  },
  partyCol: {
    gap: 4,
  },
  partyColRight: {
    gap: 4,
    alignItems: 'flex-end',
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
  },
  sigBlock: {
    marginBottom: 12,
  },
  sigRowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
