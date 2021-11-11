import { readable } from 'svelte/store';

import { notifyManager, QueriesObserver, QueryClient, QueryKey } from "../queryCore/core";
import { useQueryClient } from "../queryClientProvider";
import type { UseQueryOptions, UseQueriesStoreResult } from "../types";

export default function useQueries<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(queries: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>[]): UseQueriesStoreResult<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>[]>;
export default function useQueries<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(queries: []): UseQueriesStoreResult<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>[]>;
export default function useQueries<
    T extends readonly [...UseQueryOptions[]]
>(queries: T): UseQueriesStoreResult<T>;
export default function useQueries<
    T extends readonly [...UseQueryOptions[]]
>(queries: T): UseQueriesStoreResult<T> {
    const client: QueryClient = useQueryClient();
    const observer = new QueriesObserver(client, queries);

    const { subscribe } = readable(observer.getCurrentResult(), (set) => {
        return observer.subscribe(notifyManager.batchCalls(set));
    });

    const setQueries = (newQueries: T) => {
        if (observer.hasListeners()) {
            observer.setQueries(newQueries)
        }
    }

    return { subscribe, setQueries };
}