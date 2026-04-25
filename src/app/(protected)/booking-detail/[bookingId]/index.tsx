import { Suspense, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StackWithHeader } from '@/components/headers/stack-with-header';
import { BookingDetailHeaderContent } from '@/components/contents/booking/booking-detail-header-content';
import Loader from '@/components/primitives/loader';
import {
  BOOKING_STATUS,
  BookingStatusDisplay,
} from '@/constants/booking-constants';
import { BookingDetailFooterContent } from '@/components/contents/booking/booking-detail-footer-content';
import { COLORS } from '@/constants/style-constant';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EntityListSectionSkeleton } from '@/components/skeletons/entity-list-section-skeleton';
import VinaupEyeSquare from '@/components/icons/vinaup-eye-square.native';

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
  const router = useRouter();

  const {
    booking,
    isLoadingBooking,
    isRefreshingBooking,
    isDeletingBooking,
    bookingId,
    canEdit,
    handleDelete,
    refreshBooking,
  } = useBookingDetailContext();

  const handleRefresh = () => {
    refreshBooking();
  };

  const handleSaveAndExit = () => {
    if (!booking) return;
    refreshBooking();
  };

  const handlePressPreview = () => {
    router.push({
      pathname: '/(protected)/booking-detail/[bookingId]/booking-detail-preview',
      params: { bookingId },
    });
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
        onDelete={canEdit ? handleDelete : undefined}
        onSave={canEdit ? handleSaveAndExit : undefined}
        isDeleting={isDeletingBooking}
      />
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.actionContainer}>
          <View style={[styles.statusBadge]}>
            <Text style={[styles.statusBadgeText]}>
              {booking?.status
                ? BookingStatusDisplay[booking.status]
                : BookingStatusDisplay[BOOKING_STATUS.DRAFT]}
            </Text>
          </View>
          <View style={styles.actionButton}>
            <PressableOpacity
              style={styles.actionButtonItem}
              onPress={handlePressPreview}
            >
              <VinaupEyeSquare />
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
              refreshing={isRefreshingBooking}
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
                <Suspense fallback={<EntityListSectionSkeleton />}>
                  <ReceiptPaymentBookingListContent
                    key={`receipt-payment-list-in-booking-${bookingId}`}
                    onRefresh={handleRefresh}
                    startDate={booking.startDate}
                    endDate={booking.endDate}
                    bookingId={bookingId}
                    organizationId={booking.organization?.id}
                    canEdit={canEdit}
                  />
                </Suspense>
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.vinaupLightGreen,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
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
