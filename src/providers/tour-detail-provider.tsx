import { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import { getTourByIdApi, updateTourApi } from '@/apis/tour-apis';
import { TourResponse, UpdateTourRequest } from '@/interfaces/tour-interfaces';

interface TourDetailContextType {
  tourId: string;
  tour: TourResponse | undefined;
  isLoadingTour: boolean;
  isRefreshingTour: boolean;
  isUpdatingTour: boolean;
  handleUpdateTour: (fields: UpdateTourRequest, onSuccess?: () => void) => void;
  refreshTour: () => void;
}

const TourDetailContext = createContext<TourDetailContextType | null>(null);

export function useTourDetailContext() {
  const ctx = useContext(TourDetailContext);
  if (!ctx)
    throw new Error('useTourDetailContext must be used within TourDetailProvider');
  return ctx;
}

export function TourDetailProvider({
  tourId,
  children,
}: {
  tourId: string;
  children: React.ReactNode;
}) {
  const {
    data: tour,
    isLoading: isLoadingTour,
    isRefreshing: isRefreshingTour,
    executeFetchFn: fetchTour,
    refreshFetchFn: refreshTour,
  } = useFetchFn(() => getTourByIdApi(tourId), {
    fetchKey: `organization-tour-${tourId}`,
    tags: [`organization-tour-${tourId}`],
  });

  const { executeMutationFn: updateTour, isMutating: isUpdatingTour } =
    useMutationFn(
      (updatedFields: UpdateTourRequest) => updateTourApi(tourId, updatedFields),
      { invalidatesTags: ['organization-tour-list'] }
    );

  useEffect(() => {
    if (tourId) {
      fetchTour();
    }
  }, [tourId, fetchTour]);

  const handleUpdateTour = useCallback(
    (updatedFields: UpdateTourRequest, onSuccessCallback?: () => void) => {
      if (!tour) return;
      updateTour(updatedFields, {
        onSuccess: async () => {
          await refreshTour();
          onSuccessCallback?.();
        },
        onError: (error: ApiError) => {
          Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật.');
        },
      });
    },
    [tour, updateTour, refreshTour]
  );

  return (
    <TourDetailContext
      value={{
        tourId,
        tour: tour ?? undefined,
        isLoadingTour,
        isRefreshingTour,
        isUpdatingTour,
        handleUpdateTour,
        refreshTour,
      }}
    >
      {children}
    </TourDetailContext>
  );
}
