// src/hooks/useMutationFn.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiError } from '@/utils/classes';
import { HttpResponse } from '@/interfaces/_base-interfaces';

interface MutationState<T> {
  data: T | null;
  isMutating: boolean;
}

interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useMutationFn<T>() {
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
      options?: MutationOptions<T>
    ): Promise<HttpResponse<T> | null> => {
      setState((prev) => ({
        ...prev,
        isMutating: true,
      }));

      try {
        const response = await mutationFn();

        if (isMounted.current) {
          setState({
            data: response.data || null,
            isMutating: false,
          });
          if (response.data) options?.onSuccess?.(response.data);
          // for operations that return no data (e.g., delete)
          else options?.onSuccess?.(null as unknown as T);
        }
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        if (isMounted.current) {
          setState({
            data: null,
            isMutating: false,
          });
          if (apiError) options?.onError?.(apiError);
        }
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, isMutating: false });
  }, []);

  return { ...state, executeMutationFn, reset };
}
