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
    >(options: UseQueryOptions<TQueryFnData, TError, TData>): UseQueryStoreResult<TQueryFnData, TError, TData>
export function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    >(queryKey: QueryKey, options?: UseQueryOptions<TQueryFnData, TError, TData>): UseQueryStoreResult<TQueryFnData, TError, TData>
export function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    >(
        queryKey: QueryKey,
        queryFn: QueryFunction<TQueryFnData>,
        options?: UseQueryOptions<TQueryFnData, TError, TData>
    ): UseQueryStoreResult<TQueryFnData, TError, TData>
export default function useQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    arg1: QueryKey | UseQueryOptions<TQueryFnData, TError, TData>,
    arg2?:
        | QueryFunction<TQueryFnData>
        | UseQueryOptions<TQueryFnData, TError, TData>,
    arg3?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryStoreResult<TQueryFnData, TError, TData> {
    const options = parseQueryArgs(arg1, arg2, arg3)
    const client: QueryClient = useQueryClient()
    let defaultedOptions = client.defaultQueryObserverOptions(options)
    // Include callbacks in batch renders
    defaultedOptions = setBatchCalls<UseQueryOptions<TQueryFnData, TError, TData>>(defaultedOptions)
    const observer = new QueryObserver<TQueryFnData, TError, TData>(client, defaultedOptions)

    const { subscribe } = readable(observer.getCurrentResult(), set => {
        return observer.subscribe(notifyManager.batchCalls(set))
    })

    function setOptions(options: UseQueryOptions<TQueryFnData, TError, TData>)
    function setOptions(
        queryKey: QueryKey,
        options?: UseQueryOptions<TQueryFnData, TError, TData>
    )
    function setOptions(
        queryKey: QueryKey,
        queryFn: QueryFunction<TQueryFnData>,
        options?: UseQueryOptions<TQueryFnData, TError, TData>
    )
    function setOptions(
        arg1: QueryKey | UseQueryOptions<TQueryFnData, TError, TData>,
        arg2?:
            | QueryFunction<TQueryFnData>
            | UseQueryOptions<TQueryFnData, TError, TData>,
        arg3?: UseQueryOptions<TQueryFnData, TError, TData>
    ) {
        const options = parseQueryArgs(arg1, arg2, arg3)
        let defaultedOptions = client.defaultQueryObserverOptions(options)
        // Include callbacks in batch renders
        defaultedOptions = setBatchCalls<UseQueryOptions<TQueryFnData, TError, TData>>(defaultedOptions)
        if (observer.hasListeners()) {
            observer.setOptions(defaultedOptions)
        }
    }

    return { subscribe, setOptions }
}