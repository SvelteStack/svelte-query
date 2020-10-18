/* eslint-disable no-shadow */
import { readable } from 'svelte/store'

import { QueryObserver } from '../queryCore/core'
import { parseQueryArgs } from '../queryCore/core/utils'
import { useQueryClient } from '../queryClientProvider'
import type { QueryClient, QueryFunction, QueryKey } from '../queryCore/core'
import type { UseQueryOptions, UseQueryStoreResult } from '../types'

export function useQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
>(options: UseQueryOptions<TData, TError, TQueryFnData>): UseQueryStoreResult<TData, TError, TQueryFnData>
export function useQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
>(queryKey: QueryKey, options?: UseQueryOptions<TData, TError, TQueryFnData>): UseQueryStoreResult<TData, TError, TQueryFnData>
export function useQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TQueryFnData | TData>,
    options?: UseQueryOptions<TData, TError, TQueryFnData>
): UseQueryStoreResult<TData, TError, TQueryFnData>
export default function useQuery<TData = unknown, TError = unknown, TQueryFnData = TData>(
    arg1: QueryKey | UseQueryOptions<TData, TError, TQueryFnData>,
    arg2?:
        | QueryFunction<TData | TQueryFnData>
        | UseQueryOptions<TData, TError, TQueryFnData>,
    arg3?: UseQueryOptions<TData, TError, TQueryFnData>
): UseQueryStoreResult<TData, TError, TQueryFnData> {
    const options = parseQueryArgs(arg1, arg2, arg3)
    const client: QueryClient = useQueryClient()
    const defaultedOptions = client.defaultQueryObserverOptions(options)
    const observer = new QueryObserver<TData, TError, TQueryFnData>(client, defaultedOptions)

    const { subscribe } = readable(observer.getCurrentResult(), set => {
        return observer.subscribe(set)
    })

    function setOptions(options: UseQueryOptions<TData, TError, TQueryFnData>)
    function setOptions(
        queryKey: QueryKey,
        options?: UseQueryOptions<TData, TError, TQueryFnData>
    )
    function setOptions(
        queryKey: QueryKey,
        queryFn: QueryFunction<TQueryFnData | TData>,
        options?: UseQueryOptions<TData, TError, TQueryFnData>
    )
    function setOptions(
        arg1: QueryKey | UseQueryOptions<TData, TError, TQueryFnData>,
        arg2?:
            | QueryFunction<TData | TQueryFnData>
            | UseQueryOptions<TData, TError, TQueryFnData>,
        arg3?: UseQueryOptions<TData, TError, TQueryFnData>
    ) {
        const options = parseQueryArgs(arg1, arg2, arg3)
        const defaultedOptions = client.defaultQueryObserverOptions(options)
        if (observer.hasListeners()) {
            observer.setOptions(defaultedOptions)
        }
    }

    return { subscribe, setOptions }
}