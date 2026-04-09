import { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import {
  deleteBookingApi,
  getBookingByIdApi,
  updateBookingApi,
} from '@/apis/booking-apis';
import { getReceiptPaymentsByBookingIdApi } from '@/apis/receipt-payment-apis';
import {
  BookingResponse,
  UpdateBookingRequest,
} from '@/interfaces/booking-interfaces';
import { ReceiptPaymentResponse } from '@/interfaces/receipt-payment-interfaces';
import { useRouter } from 'expo-router';

interface BookingDetailContextType {
  bookingId: string;
  booking: BookingResponse | undefined;
  isLoadingBooking: boolean;
  isRefreshingBooking: boolean;
  isUpdatingBooking: boolean;
  isDeletingBooking: boolean;
  receiptPayments: ReceiptPaymentResponse[];
  isLoadingReceiptPayments: boolean;
  isRefreshingReceiptPayments: boolean;
  handleUpdateBooking: (
    fields: UpdateBookingRequest,
    onSuccess?: () => void
  ) => void;
  handleDelete: () => void;
  refreshBooking: () => void;
  refreshReceiptPayments: () => void;
}

const BookingDetailContext = createContext<BookingDetailContextType | null>(null);

export function useBookingDetailContext() {
  const ctx = useContext(BookingDetailContext);
  if (!ctx)
    throw new Error(
      'useBookingDetailContext must be used within BookingDetailProvider'
    );
  return ctx;
}

export function BookingDetailProvider({
  bookingId,
  children,
}: {
  bookingId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    data: booking,
    isLoading: isLoadingBooking,
    isRefreshing: isRefreshingBooking,
    executeFetchFn: fetchBooking,
    refreshFetchFn: refreshBooking,
  } = useFetchFn(() => getBookingByIdApi(bookingId), {
    fetchKey: `organization-booking-${bookingId}`,
    tags: [`organization-booking-${bookingId}`],
  });

  const { executeMutationFn: updateBooking, isMutating: isUpdatingBooking } =
    useMutationFn(
      (updatedFields: UpdateBookingRequest) =>
        updateBookingApi(bookingId, updatedFields),
      { invalidatesTags: ['organization-booking-list'] }
    );

  const { executeMutationFn: deleteBooking, isMutating: isDeletingBooking } =
    useMutationFn(() => deleteBookingApi(bookingId), {
      invalidatesTags: ['organization-booking-list'],
    });

  const {
    data: receiptPayments,
    isLoading: isLoadingReceiptPayments,
    isRefreshing: isRefreshingReceiptPayments,
    executeFetchFn: fetchReceiptPayments,
    refreshFetchFn: refreshReceiptPayments,
  } = useFetchFn(() => getReceiptPaymentsByBookingIdApi(bookingId), {
    tags: [`organization-receipt-payment-list-in-booking-${bookingId}`],
  });

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
      fetchReceiptPayments();
    }
  }, [bookingId, fetchBooking, fetchReceiptPayments]);

  const handleUpdateBooking = useCallback(
    (updatedFields: UpdateBookingRequest, onSuccessCallback?: () => void) => {
      if (!booking) return;
      updateBooking(updatedFields, {
        onSuccess: () => {
          refreshBooking();
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      });
    },
    [booking, updateBooking, refreshBooking]
  );

  const handleDelete = useCallback(() => {
    if (!bookingId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          deleteBooking({
            onSuccess: () => {
              router.back();
            },
            onError: (error: ApiError) => {
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  }, [bookingId, deleteBooking, router]);

  return (
    <BookingDetailContext
      value={{
        bookingId,
        booking: booking ?? undefined,
        isLoadingBooking,
        isRefreshingBooking,
        isUpdatingBooking,
        isDeletingBooking,
        receiptPayments: receiptPayments ?? [],
        isLoadingReceiptPayments,
        isRefreshingReceiptPayments,
        handleUpdateBooking,
        handleDelete,
        refreshBooking,
        refreshReceiptPayments,
      }}
    >
      {children}
    </BookingDetailContext>
  );
}
