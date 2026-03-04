import { useState, useRef, useEffect, useCallback } from 'react';
import { ApiError } from '@/utils/classes';
import { HttpResponse } from '@/interfaces/_base-interfaces';
import { DeviceEventEmitter } from 'react-native';

interface FetchOptions {
  tags?: string[];
}
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: ApiError | null;
}

export function useFetchFn<T>(options?: FetchOptions) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    isRefreshing: false,
    error: null,
  });

  // Incase user navigates away from the curernt component (screen)
  // This will prevent error of setting state on unmounted component
  const isMounted = useRef<boolean>(true);
  const lastFetchFn = useRef<() => Promise<HttpResponse<T>>>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (
      fetchFn: () => Promise<HttpResponse<T>>,
      options: { isRefresh: boolean }
    ): Promise<HttpResponse<T> | null> => {
      lastFetchFn.current = fetchFn;

      setState((prev) => ({
        ...prev,
        isLoading: !options.isRefresh, // only show loading when not refreshing
        isRefreshing: !!options.isRefresh,
        error: null,
      }));

      try {
        const response = await fetchFn();

        if (isMounted.current) {
          setState({
            data: response.data || null,
            isLoading: false,
            isRefreshing: false,
            error: null,
          });
        }
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        if (isMounted.current) {
          setState({
            data: null,
            isLoading: false,
            isRefreshing: false,
            error: apiError,
          });
        }
        return null;
      }
    },
    []
  );

  const executeFetchFn = useCallback(
    (fetchFn: () => Promise<HttpResponse<T>>) => {
      return execute(fetchFn, { isRefresh: false });
    },
    [execute]
  );

  const refreshFetchFn = useCallback(() => {
    if (lastFetchFn.current) {
      return execute(lastFetchFn.current, { isRefresh: true });
    }
    return null;
  }, [execute]);

  useEffect(() => {
    if (!options?.tags || options.tags.length === 0) return;

    const subscriptions = options.tags.map((tag) =>
      DeviceEventEmitter.addListener(tag, () => {
        refreshFetchFn();
      })
    );
    return () => subscriptions.forEach((sub) => sub.remove());
  }, [options?.tags, refreshFetchFn]);

  return { ...state, executeFetchFn, refreshFetchFn };
}
