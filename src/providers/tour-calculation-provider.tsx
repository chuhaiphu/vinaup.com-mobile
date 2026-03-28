import { createContext, useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFetchFn, useMutationFn, type ApiError } from 'fetchwire';
import { getTourByIdApi, updateTourApi } from '@/apis/tour-apis';
import { TourResponse, UpdateTourRequest } from '@/interfaces/tour-interfaces';

interface TourCalculationContextType {
  tourId: string;
  tour: TourResponse | undefined;
  isLoadingTour: boolean;
  isRefreshingTour: boolean;
  isUpdatingTour: boolean;
  handleUpdateTour: (fields: UpdateTourRequest, onSuccess?: () => void) => void;
  refreshTour: () => void;
}

const TourCalculationContext = createContext<TourCalculationContextType | null>(null);

export function useTourCalculationContext() {
  const ctx = useContext(TourCalculationContext);
  if (!ctx) throw new Error('useTourCalculationContext must be used within TourCalculationProvider');
  return ctx;
}

export function TourCalculationProvider({
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
    tags: [`organization-tour-${tourId}`],
  });

  const { executeMutationFn: updateTour, isMutating: isUpdatingTour } = useMutationFn(
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
        onSuccess: () => {
          refreshTour();
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
    <TourCalculationContext
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
    </TourCalculationContext>
  );
}
