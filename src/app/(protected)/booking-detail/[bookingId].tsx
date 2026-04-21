import { View, StyleSheet, Text, ScrollView, RefreshControl } from 'react-native';
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
import BookingSignatureSectionContent from '@/components/contents/booking/booking-signature-section-content';
import { BookingSignaturePopover } from '@/components/popovers/booking-signature-popover';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookingDetailScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  return (
    <BookingDetailProvider bookingId={bookingId}>
      <BookingDetailScreenContent />
    </BookingDetailProvider>
  );
}

function BookingDetailScreenContent() {
  const [isSignatureInfoPopoverVisible, setIsSignatureInfoPopoverVisible] =
    useState(false);
  const insets = useSafeAreaInsets();

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

  const handleRefresh = () => {
    refreshBooking();
    refreshReceiptPayments();
  };

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
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
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

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingBooking || isRefreshingReceiptPayments}
              onRefresh={handleRefresh}
              colors={[COLORS.vinaupTeal]}
              tintColor={COLORS.vinaupTeal}
            />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <View
              style={{
                flex: 1,
              }}
            >
              <BookingDetailHeaderContent />
              {booking && (
                <ReceiptPaymentBookingListContent
                  onRefresh={handleRefresh}
                  receiptPayments={receiptPayments}
                  startDate={booking.startDate}
                  endDate={booking.endDate}
                  loading={isLoadingReceiptPayments}
                  refreshing={isRefreshingReceiptPayments}
                  bookingId={bookingId}
                  organizationId={booking.organization?.id}
                />
              )}
            </View>
            <BookingDetailFooterContent />
          </View>
        </ScrollView>

        <BookingSignaturePopover
          isVisible={isSignatureInfoPopoverVisible}
          onClose={() => setIsSignatureInfoPopoverVisible(false)}
          containerStyle={styles.signatureInfoPopoverContainer}
        />
        <View style={styles.bookingSignatureContainer}>
          {booking && (
            <BookingSignatureSectionContent
              bookingData={booking}
              onOpenSignatureInfoPopover={() =>
                setIsSignatureInfoPopoverVisible(true)
              }
            />
          )}
        </View>
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
  signatureInfoPopoverContainer: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  bookingSignatureContainer: {
    backgroundColor: COLORS.vinaupLightGreen,
    paddingHorizontal: 8,
    borderRadius: 8,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
});
