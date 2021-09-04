/* eslint-disable no-shadow */
import { readable } from 'svelte/store'

import { hashQueryKeyByOptions, parseQueryArgs } from '../queryCore/core/utils'
import { useQueryClient } from '../queryClientProvider'
import { InfiniteQueryObserver } from '../queryCore/core/infiniteQueryObserver'
import { notifyManager, QueryClient, QueryFunction, QueryKey } from '../queryCore/core'
import type { UseInfiniteQueryOptions, UseInfiniteQueryStoreResult } from '../types'
import { setBatchCalls } from '../utils'

export function useInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
): UseInfiniteQueryStoreResult<TQueryFnData, TError, TData, TQueryKey>
export function useInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    queryKey: TQueryKey,
    options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
): UseInfiniteQueryStoreResult<TQueryFnData, TError, TData, TQueryKey>
export function useInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
): UseInfiniteQueryStoreResult<TQueryFnData, TError, TData, TQueryKey>
export default function useInfiniteQuery<TQueryFnData, TError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
    arg1: TQueryKey | UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    arg2?:
        | QueryFunction<TQueryFnData, TQueryKey>
        | UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
): UseInfiniteQueryStoreResult<TQueryFnData, TError, TData, TQueryKey> {
    const options = parseQueryArgs(arg1, arg2, arg3)
    const client: QueryClient = useQueryClient()
    let defaultedOptions = client.defaultQueryObserverOptions(options)
    // Include callbacks in batch renders
    defaultedOptions = setBatchCalls<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>>(defaultedOptions)
    const observer = new InfiniteQueryObserver<TQueryFnData, TError, TData>(client, defaultedOptions)

    const { subscribe } = readable(observer.getCurrentResult(), set => {
        return observer.subscribe(notifyManager.batchCalls(set))
    })

    // between creating the observer and subscribing to it.
    observer.updateResult()

    function setOptions(options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>)
    function setOptions(
        queryKey: TQueryKey,
        options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
    )
    function setOptions(
        queryKey: TQueryKey,
        queryFn: QueryFunction<TQueryFnData, TQueryKey>,
        options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
    )
    function setOptions(
        arg1: TQueryKey | UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
        arg2?:
            | QueryFunction<TQueryFnData, TQueryKey>
            | UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
        arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
    ) {
        if (observer.hasListeners()) {
            const options = parseQueryArgs(arg1, arg2, arg3)
            let defaultedOptions = client.defaultQueryObserverOptions(options)
            // Include callbacks in batch renders
            defaultedOptions = setBatchCalls<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>>(defaultedOptions)
            observer.setOptions(defaultedOptions)
        }
    }

    function updateOptions(options: Partial<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>>): void {
        const mergedOptions = { ...observer.options, ...options }

        if (options.queryKey && !options.queryHash && options.queryKey !== observer.options.queryKey) {
            mergedOptions.queryHash = hashQueryKeyByOptions(options.queryKey, mergedOptions)
        }

        observer.setOptions(mergedOptions)
    }

    function setEnabled(enabled: boolean): void {
        updateOptions({ enabled })
    }

    return { subscribe, setOptions, updateOptions, setEnabled }
}