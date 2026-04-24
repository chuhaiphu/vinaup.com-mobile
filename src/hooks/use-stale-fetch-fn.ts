import { useFetchFn } from 'fetchwire';
import type { FetchOptions, HttpResponse } from 'fetchwire';
import { useEffect, useCallback } from 'react';
import {
    registerFetchKey,
    incrementTagSubscribers,
    decrementTagSubscribers,
    isKeyStale,
    clearStale,
} from '@/utils/fetch-cache';

/**
 * Drop-in replacement for useFetchFn that adds stale-aware cache behavior.
 *
 * Problem it solves:
 *   When a mutation invalidates a tag but no component is subscribed (e.g. modal
 *   is closed), fetchwire's event is lost. On next mount, executeFetchFn() would
 *   return stale cached data. This hook detects that stale state and automatically
 *   calls refreshFetchFn() instead.
 *
 * Usage: identical to useFetchFn — just swap the import.
 */
export function useStaleFetchFn<T>(
    fetchFn: () => Promise<HttpResponse<T>>,
    options: FetchOptions
) {
    const result = useFetchFn(fetchFn, options);
    const { fetchKey, tags = [] } = options;

    // Register tag → fetchKey mapping once
    useEffect(() => {
        registerFetchKey(fetchKey, tags);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchKey]);

    // Track subscriber count for stale detection
    useEffect(() => {
        if (tags.length === 0) return;
        incrementTagSubscribers(tags);
        return () => decrementTagSubscribers(tags);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags.join(',')]);

    // Stale-aware execute: if key is stale, bypass cache with refresh
    const executeFetchFn = useCallback(async () => {
        if (isKeyStale(fetchKey)) {
            clearStale(fetchKey);
            return result.refreshFetchFn();
        }
        return result.executeFetchFn();
    }, [fetchKey, result]);

    return {
        ...result,
        executeFetchFn,
    };
}
