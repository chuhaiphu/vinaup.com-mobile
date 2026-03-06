// src/hooks/useMutationFn.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiError } from '@/utils/api-error';
import { HttpResponse } from '@/interfaces/_base-interfaces';
import { DeviceEventEmitter } from 'react-native';

interface MutationState<T> {
  data: T | null;
  isMutating: boolean;
}

interface MutationOptions {
  invalidatesTags?: string[];
}

interface ExecuteMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useMutationFn<T>(options?: MutationOptions) {
  const [state, setState] = useState<MutationState<T>>({
    data: null,
    isMutating: false,
  });
  const isMounted = useRef<boolean>(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const executeMutationFn = useCallback(
    async (
      mutationFn: () => Promise<HttpResponse<T>>,
      executeMutationOptions?: ExecuteMutationOptions<T>
    ): Promise<HttpResponse<T> | null> => {
      setState((prev) => ({
        ...prev,
        isMutating: true,
      }));

      try {
        const response = await mutationFn();
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (isMounted.current) {
          setState({
            data: response.data || null,
            isMutating: false,
          });
          options?.invalidatesTags?.forEach((tag) => {
            DeviceEventEmitter.emit(tag);
          });
          if (response.data) executeMutationOptions?.onSuccess?.(response.data);
          // for operations that return no data (e.g., delete)
          else executeMutationOptions?.onSuccess?.(null as unknown as T);
        }
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        if (isMounted.current) {
          setState({
            data: null,
            isMutating: false,
          });
          if (apiError) executeMutationOptions?.onError?.(apiError);
        }
        return null;
      }
    },
    [options?.invalidatesTags]
  );

  const reset = useCallback(() => {
    setState({ data: null, isMutating: false });
  }, []);

  return { ...state, executeMutationFn, reset };
}
