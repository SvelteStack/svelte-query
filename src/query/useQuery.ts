/* eslint-disable no-shadow */
import { readable } from 'svelte/store'

import { notifyManager, QueryObserver } from '../queryCore/core'
import { parseQueryArgs } from '../queryCore/core/utils'
import { useQueryClient } from '../queryClientProvider'
import type { QueryClient, QueryFunction, QueryKey } from '../queryCore/core'
import type { UseQueryOptions, UseQueryStoreResult } from '../types'
import { setBatchCalls } from '../utils'

export function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>): UseQueryStoreResult<TQueryFnData, TError, TData, TQueryKey>
export function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(queryKey: TQueryKey, options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>): UseQueryStoreResult<TQueryFnData, TError, TData, TQueryKey>
export function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseQueryStoreResult<TQueryFnData, TError, TData, TQueryKey>
export default function useQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
    arg1: TQueryKey | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    arg2?:
        | QueryFunction<TQueryFnData, TQueryKey>
        | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    arg3?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryStoreResult<TQueryFnData, TError, TData, TQueryKey> {
    const options = parseQueryArgs(arg1, arg2, arg3)
    const client: QueryClient = useQueryClient()
    let defaultedOptions = client.defaultQueryObserverOptions(options)
    // Include callbacks in batch renders
    defaultedOptions = setBatchCalls<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>(defaultedOptions)
    const observer = new QueryObserver<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>(client, defaultedOptions)

    const { subscribe } = readable(observer.getCurrentResult(), set => {
        return observer.subscribe(notifyManager.batchCalls(set))
    })

    // Update result to make sure we did not miss any query updates
    // between creating the observer and subscribing to it.
    observer.updateResult()

    function setOptions(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>)
    function setOptions(
        queryKey: TQueryKey,
        options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    )
    function setOptions(
        queryKey: TQueryKey,
        queryFn: QueryFunction<TQueryFnData, TQueryKey>,
        options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    )
    function setOptions(
        arg1: TQueryKey | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        arg2?:
            | QueryFunction<TQueryFnData, TQueryKey>
            | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        arg3?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    ) {
        const options = parseQueryArgs(arg1, arg2, arg3)
        let defaultedOptions = client.defaultQueryObserverOptions(options)
        // Include callbacks in batch renders
        defaultedOptions = setBatchCalls<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>(defaultedOptions)
        if (observer.hasListeners()) {
            observer.setOptions(defaultedOptions, { listeners: false })
        }
    }

    function updateOptions(options: Partial<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>): void {
        observer.updateOptions(options)
    }

    function setEnabled(enabled: boolean): void {
        updateOptions({ enabled })
    }

    return { subscribe, setOptions, updateOptions, setEnabled }
}