/* eslint-disable no-shadow */
import { readable } from 'svelte/store'

import { parseQueryArgs } from '../queryCore/core/utils'
import { useQueryClient } from '../queryClientProvider'
import { InfiniteQueryObserver } from '../queryCore/core/infiniteQueryObserver'
import { notifyManager, QueryClient, QueryFunction, QueryKey } from '../queryCore/core'
import type { UseInfiniteQueryOptions, UseInfiniteQueryStoreResult } from '../types'
import { setBatchCalls } from '../utils'

export function useInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    >(
        options: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
    ): UseInfiniteQueryStoreResult<TQueryFnData, TError, TData>
export function useInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    >(
        queryKey: QueryKey,
        options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
    ): UseInfiniteQueryStoreResult<TQueryFnData, TError, TData>
export function useInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    >(
        queryKey: QueryKey,
        queryFn: QueryFunction<TQueryFnData>,
        options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
    ): UseInfiniteQueryStoreResult<TQueryFnData, TError, TData>
export default function useInfiniteQuery<TQueryFnData, TError, TData = TQueryFnData>(
    arg1: QueryKey | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
    arg2?:
        | QueryFunction<TQueryFnData>
        | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
    arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): UseInfiniteQueryStoreResult<TQueryFnData, TError, TData> {
    const options = parseQueryArgs(arg1, arg2, arg3)
    const client: QueryClient = useQueryClient()
    let defaultedOptions = client.defaultQueryObserverOptions(options)
    // Include callbacks in batch renders
    defaultedOptions = setBatchCalls<UseInfiniteQueryOptions<TQueryFnData, TError, TData>>(defaultedOptions)
    const observer = new InfiniteQueryObserver<TQueryFnData, TError, TData>(client, defaultedOptions)

    const { subscribe } = readable(observer.getCurrentResult(), set => {
        return observer.subscribe(notifyManager.batchCalls(set))
    })

    // between creating the observer and subscribing to it.
    observer.updateResult()

    function setOptions(options: UseInfiniteQueryOptions<TQueryFnData, TError, TData>)
    function setOptions(
        queryKey: QueryKey,
        options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
    )
    function setOptions(
        queryKey: QueryKey,
        queryFn: QueryFunction<TQueryFnData>,
        options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
    )
    function setOptions(
        arg1: QueryKey | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
        arg2?:
            | QueryFunction<TQueryFnData>
            | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
        arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
    ) {
        if (observer.hasListeners()) {
            const options = parseQueryArgs(arg1, arg2, arg3)
            let defaultedOptions = client.defaultQueryObserverOptions(options)
            // Include callbacks in batch renders
            defaultedOptions = setBatchCalls<UseInfiniteQueryOptions<TQueryFnData, TError, TData>>(defaultedOptions)
            observer.setOptions(defaultedOptions)
        }
    }

    function updateOptions(options: Partial<UseInfiniteQueryOptions<TQueryFnData, TError, TData>>): void {
        observer.setOptions({ ...observer.options, ...options })
    }

    function setEnabled(enabled: boolean): void {
        updateOptions({ enabled })
    }

    return { subscribe, setOptions, updateOptions, setEnabled }
}