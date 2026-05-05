import { COLORS } from '@/constants/style-constant';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useMutationFn, type ApiError } from 'fetchwire';
import { updateTourCalculationApi } from '@/apis/tour/tour-calculation';
import { UpdateTourCalculationRequest } from '@/interfaces/tour-calculation-interfaces';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { VinaupPenLine } from '@/components/icons/vinaup-pen-line.native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { TourCalculationTicketModal } from '../modals/tour-calculation-ticket-form-modal/tour-calculation-ticket-modal';
import { SlideSheetRef } from '@/components/primitives/slide-sheet';
import { TourCalculationTaxModal } from '../modals/tour-calculation-tax-input-modal/tour-calculation-tax-input';
import { TourCalculationTicketSummaryPopover } from '../popovers/tour-calculation-ticket-summary-popover';

interface TourCalculationTicketSummaryProps {
  id: string;
  tourId: string;
  onUpdated?: () => void;
  adultTicketCount?: number;
  childTicketCount?: number;
  adultTicketPrice?: number;
  childTicketPrice?: number;
  taxRate?: number;
  totalReceipt: string;
  totalPayment: string;
  totalTaxPay: string;
  netProfitBeforeTaxPay: string;
  netProfitAfterTaxPay: string;
  profitMarginBeforeTaxPay: string;
  profitMarginAfterTaxPay: string;
}

export function TourCalculationTicketSummary({
  id,
  tourId,
  onUpdated,
  adultTicketCount = 0,
  childTicketCount = 0,
  adultTicketPrice = 0,
  childTicketPrice = 0,
  taxRate = 0,
  totalReceipt,
  totalPayment,
  totalTaxPay,
  netProfitBeforeTaxPay,
  netProfitAfterTaxPay,
  profitMarginBeforeTaxPay,
  profitMarginAfterTaxPay,
}: TourCalculationTicketSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAfterTax] = useState(true);

  const totalTickets = adultTicketCount + childTicketCount;

  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  const tourTicketModalRef = useRef<SlideSheetRef>(null);
  const taxModalRef = useRef<SlideSheetRef>(null);
  const handleOpenTourTicketModal = () => {
    tourTicketModalRef.current?.open();
  };
  const handleOpenTaxModal = () => {
    taxModalRef.current?.open();
  };

  const updateTourCalculationFn = (updatedFields: UpdateTourCalculationRequest) =>
    updateTourCalculationApi(id, updatedFields);

  const {
    executeMutationFn: updateTourCalculation,
    isMutating: isUpdatingCalculation,
  } = useMutationFn(updateTourCalculationFn);

  const handleConfirmUpdateTourTicket = (
    data: {
      adultPrice: number;
      childPrice: number;
      adultQuantity: number;
      childQuantity: number;
    },
    onSuccessCallback?: () => void
  ) => {
    updateTourCalculation(
      {
        adultTicketCount: data.adultQuantity,
        childTicketCount: data.childQuantity,
        adultTicketPrice: data.adultPrice,
        childTicketPrice: data.childPrice,
      },
      {
        onSuccess: () => {
          onUpdated?.();
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      }
    );
  };

  const handleConfirmUpdateTax = (newTaxRate: number, onSuccess: () => void) => {
    updateTourCalculation(
      { taxRate: newTaxRate },
      {
        onSuccess: () => {
          onUpdated?.();
          onSuccess();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật thuế.');
        },
      }
    );
  };

  return (
    <View style={[styles.container, !isExpanded && styles.collapsedBorder]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Người lớn ({adultTicketCount}) + Trẻ em ({childTicketCount}) ={' '}
          {totalTickets}
        </Text>
        <View style={styles.headerActions}>
          <PressableOpacity onPress={handleOpenTourTicketModal} hitSlop={4}>
            <AntDesign name="edit" size={22} color={COLORS.vinaupTeal} />
          </PressableOpacity>
          <PressableOpacity onPress={() => setIsExpanded(!isExpanded)} hitSlop={4}>
            <View style={styles.expandToggle}>
              <FontAwesome
                name={isExpanded ? 'caret-down' : 'caret-up'}
                size={24}
                color={COLORS.vinaupTeal}
                style={isExpanded ? { marginTop: 0 } : { marginTop: -2 }}
              />
            </View>
          </PressableOpacity>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={[styles.columnText, styles.boldText]}>Số lượng</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={[styles.columnText, styles.boldText, styles.textRight]}>
                Giá bán <Text style={styles.normalWeight}>(dự kiến)</Text>
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <View style={styles.subColumnContainer}>
                <Text style={styles.subLabel}>Người lớn</Text>
                <Text style={styles.subEqual}>=</Text>
                <Text style={styles.subValue}>{adultTicketCount}</Text>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.subColumnContainer}>
                <Text style={[styles.subLabel, styles.subLabelRight]}>
                  Người lớn
                </Text>
                <Text style={[styles.subEqual, styles.subEqualRight]}>=</Text>
                <Text style={[styles.subValue, styles.subValueRight]}>
                  {formatNumber(adultTicketPrice)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <View style={styles.subColumnContainer}>
                <Text style={styles.subLabel}>Trẻ em</Text>
                <Text style={styles.subEqual}>=</Text>
                <Text style={styles.subValue}>{childTicketCount}</Text>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.subColumnContainer}>
                <Text style={[styles.subLabel, styles.subLabelRight]}>Trẻ em</Text>
                <Text style={[styles.subEqual, styles.subEqualRight]}>=</Text>
                <Text style={[styles.subValue, styles.subValueRight]}>
                  {formatNumber(childTicketPrice)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.summaryLabel}>Tổng thu</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={[styles.summaryValue, styles.textRight]}>
                {totalReceipt}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.summaryLabel}>Tổng chi</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={[styles.summaryValue, styles.textRight]}>
                {totalPayment}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.summaryLabel}>Thuế phải nộp</Text>
              <View style={styles.taxRateBadge}>
                <Text style={styles.taxRateText}>{taxRate} %</Text>
                <PressableOpacity onPress={handleOpenTaxModal}>
                  <VinaupPenLine width={15} height={15} />
                </PressableOpacity>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <Text style={[styles.summaryValue, styles.textRight]}>
                {totalTaxPay}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.summaryLabel}>
                Lợi nhuận {isAfterTax ? 'sau' : 'trước'} thuế
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <Text
                style={[styles.summaryValue, styles.boldText, styles.textRight]}
              >
                {isAfterTax ? netProfitAfterTaxPay : netProfitBeforeTaxPay}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.summaryLabel}>Tỷ suất lợi nhuận</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={[styles.summaryValue, styles.textRight]}>
                {isAfterTax ? profitMarginAfterTaxPay : profitMarginBeforeTaxPay}
              </Text>
            </View>
          </View>

          {/* <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Lợi nhuận sau thuế</Text>
            <Switch
              value={isAfterTax}
              onValueChange={setIsAfterTax}
              trackColor={{ false: '#D1D1D1', true: '#81b0ff' }}
            />
          </View> */}
        </View>
      )}
      <TourCalculationTicketModal
        initialData={{
          adultPrice: adultTicketPrice,
          childPrice: childTicketPrice,
          adultQuantity: adultTicketCount,
          childQuantity: childTicketCount,
        }}
        modalRef={tourTicketModalRef}
        isLoading={isUpdatingCalculation}
        onConfirm={(data, onSuccessCallback) =>
          handleConfirmUpdateTourTicket(data, onSuccessCallback)
        }
      />
      <TourCalculationTaxModal
        modalRef={taxModalRef}
        initialTaxRate={taxRate}
        isLoading={isUpdatingCalculation}
        onConfirm={handleConfirmUpdateTax}
      />
      <TourCalculationTicketSummaryPopover onPenClick={handleOpenTourTicketModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: COLORS.vinaupMediumDarkGray,
  },
  expandToggle: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.vinaupYellow,
    borderWidth: 1,
    borderRadius: 16,
  },
  headerActions: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  contentContainer: { marginTop: 8 },
  row: { flexDirection: 'row', paddingVertical: 4 },
  leftColumn: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 2,
    gap: 4,
  },
  rightColumn: { flex: 1, paddingLeft: 2 },

  subColumnContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  subLabel: { flex: 1.5, fontSize: 16 },
  subEqual: { width: 16, fontSize: 16, textAlign: 'center' },
  subValue: { flex: 2, fontSize: 16 },
  subLabelRight: { textAlign: 'right' },
  subEqualRight: { textAlign: 'right' },
  subValueRight: { flex: 1.5, textAlign: 'right' },

  columnText: { fontSize: 16 },
  textRight: { textAlign: 'right' },
  boldText: { fontWeight: 'bold' },
  normalWeight: { fontWeight: 'normal' },
  divider: {
    height: 1,
    backgroundColor: COLORS.vinaupLightGray,
    marginVertical: 8,
  },
  summaryLabel: { fontSize: 16 },
  summaryValue: { fontSize: 16 },
  taxRateBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  taxRateText: { fontSize: 16, fontWeight: '500' },
  smallIcon: { fontSize: 12 },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  toggleLabel: { fontSize: 14 },
  collapsedBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupLightGray,
  },
});
