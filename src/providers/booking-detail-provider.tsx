import { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import {
  deleteBookingApi,
  getBookingByIdApi,
  updateBookingApi,
} from '@/apis/booking-apis';
import {
  BookingMeta,
  BookingResponse,
  UpdateBookingRequest,
} from '@/interfaces/booking-interfaces';
import { ResponseWithMeta } from '@/interfaces/_meta.interfaces';
import { useRouter } from 'expo-router';

interface BookingDetailContextType {
  bookingId: string;
  booking: ResponseWithMeta<BookingResponse, BookingMeta> | undefined;
  canEdit: boolean;
  isLoadingBooking: boolean;
  isRefreshingBooking: boolean;
  isUpdatingBooking: boolean;
  isDeletingBooking: boolean;
  handleUpdateBooking: (
    fields: UpdateBookingRequest,
    onSuccess?: () => void
  ) => void;
  handleDelete: (onStart?: () => void, onFinish?: () => void) => void;
  refreshBooking: () => void;
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
      { invalidatesTags: ['organization-booking-list', `organization-booking-${bookingId}`] }
    );

  const deleteInvalidateTags = [
    'organization-booking-list',
    ...(booking?.tourImplementationId
      ? [`organization-booking-list-in-tour-implementation-${booking.tourImplementationId}`]
      : []),
  ];

  const { executeMutationFn: deleteBooking, isMutating: isDeletingBooking } =
    useMutationFn(() => deleteBookingApi(bookingId), {
      invalidatesTags: deleteInvalidateTags,
    });

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, fetchBooking]);

  const handleUpdateBooking = useCallback(
    (updatedFields: UpdateBookingRequest, onSuccessCallback?: () => void) => {
      if (!booking) return;
      updateBooking(updatedFields, {
        onSuccess: () => {
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      });
    },
    [booking, updateBooking]
  );

  const handleDelete = useCallback((onStart?: () => void, onFinish?: () => void) => {
    if (!bookingId) return;
    Alert.alert('Xác nhận', 'Bạn muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          onStart?.();
          deleteBooking({
            onSuccess: () => {
              onFinish?.();
              router.back();
            },
            onError: (error: ApiError) => {
              onFinish?.();
              Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xóa.');
            },
          });
        },
      },
    ]);
  }, [bookingId, deleteBooking, router]);

  const canEdit = booking?.meta?.canEdit ?? false;

  return (
    <BookingDetailContext
      value={{
        bookingId,
        booking: booking ?? undefined,
        canEdit,
        isLoadingBooking,
        isRefreshingBooking,
        isUpdatingBooking,
        isDeletingBooking,
        handleUpdateBooking,
        handleDelete,
        refreshBooking,
      }}
    >
      {children}
    </BookingDetailContext>
  );
}
