import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { BookingDetailHeaderContent } from '@/components/contents/booking/booking-detail-header-content';
import Loader from '@/components/primitives/loader';
import { Select } from '@/components/primitives/select';
import { BookingStatus, BookingStatusOptions } from '@/constants/booking-constants';
import { BookingDetailFooterContent } from '@/components/contents/booking/booking-detail-footer-content';
import { COLORS } from '@/constants/style-constant';
import VinaupVerticalExpandArrow from '@/components/icons/vinaup-vertical-expand-arrow.native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import {
  BookingDetailProvider,
  useBookingDetailContext,
} from '@/providers/booking-detail-provider';
import { OrganizationCustomerProvider } from '@/providers/organization-customer-provider';
import { ReceiptPaymentBookingListContent } from '@/components/contents/booking/receipt-payment-booking-list-content';

export default function BookingDetailScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  return (
    <BookingDetailProvider bookingId={bookingId}>
      <BookingDetailScreenContent />
    </BookingDetailProvider>
  );
}

function BookingDetailScreenContent() {
  const {
    booking,
    isLoadingBooking,
    isUpdatingBooking,
    isRefreshingBooking,
    isDeletingBooking,
    receiptPayments,
    isLoadingReceiptPayments,
    isRefreshingReceiptPayments,
    bookingId,
    handleUpdateBooking,
    handleDelete,
    refreshBooking,
    refreshReceiptPayments,
  } = useBookingDetailContext();

  const handleSaveAndExit = () => {
    if (!booking) return;
    refreshBooking();
    refreshReceiptPayments();
  };

  if (isLoadingBooking) {
    return (
      <View>
        <Loader size={64} />
      </View>
    );
  }

  return (
    <OrganizationCustomerProvider organizationId={booking?.organization?.id}>
      <StackWithHeader
        title={'Chi tiết Booking'}
        onDelete={handleDelete}
        onSave={handleSaveAndExit}
        isDeleting={isDeletingBooking}
      />
      <View style={styles.container}>
        <View style={styles.actionContainer}>
          <View style={styles.statusFilter}>
            <Select
              renderTrigger={(option) => (
                <>
                  <VinaupVerticalExpandArrow width={16} height={16} />
                  <Text style={{ color: COLORS.vinaupTeal }}>
                    {option.label || 'Trạng thái'}
                  </Text>
                </>
              )}
              isLoading={isUpdatingBooking || isRefreshingBooking}
              options={BookingStatusOptions}
              value={booking?.status || ''}
              onChange={(value) =>
                handleUpdateBooking({ status: value as BookingStatus })
              }
              placeholder="Trạng thái"
              style={{
                triggerText: {
                  fontSize: 16,
                  color: COLORS.vinaupTeal,
                },
              }}
            />
          </View>
          <View style={styles.actionButton}>
            <PressableOpacity style={styles.actionButtonItem}>
              <Text style={styles.actionButtonItemText}>Booking</Text>
            </PressableOpacity>
            <PressableOpacity style={styles.actionButtonItem}>
              <FontAwesome5 name="copy" size={18} color={COLORS.vinaupTeal} />
            </PressableOpacity>
            <PressableOpacity style={styles.actionButtonItem}>
              <Entypo
                name="dots-three-horizontal"
                size={18}
                color={COLORS.vinaupTeal}
              />
            </PressableOpacity>
          </View>
        </View>
        {/* TODO: Add editable tourImplementation selector in a later phase. */}
        <BookingDetailHeaderContent />
        {booking && (
          <ReceiptPaymentBookingListContent
            onRefresh={() => {
              refreshBooking();
              refreshReceiptPayments();
            }}
            receiptPayments={receiptPayments}
            startDate={booking.startDate}
            endDate={booking.endDate}
            loading={isLoadingReceiptPayments}
            refreshing={isRefreshingReceiptPayments}
            bookingId={bookingId}
            organizationId={booking.organization?.id}
          />
        )}
        <BookingDetailFooterContent />
      </View>
    </OrganizationCustomerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionContainer: {
    marginVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonItem: {},
  actionButtonItemText: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
