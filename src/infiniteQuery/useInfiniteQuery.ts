/* eslint-disable no-shadow */
import { readable } from 'svelte/store'

import { parseQueryArgs } from '../queryCore/core/utils'
import { useQueryClient } from '../queryClientProvider'
import { InfiniteQueryObserver } from '../queryCore/core/infiniteQueryObserver'
import type { QueryClient, QueryFunction, QueryKey } from '../queryCore/core'
import type { UseInfiniteQueryOptions, UseInfiniteQueryStoreResult } from '../types'

export function useInfiniteQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
>(
    options: UseInfiniteQueryOptions<TData, TError, TQueryFnData>
): UseInfiniteQueryStoreResult<TData, TError, TQueryFnData>
export function useInfiniteQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
>(
    queryKey: QueryKey,
    options?: UseInfiniteQueryOptions<TData, TError, TQueryFnData>
): UseInfiniteQueryStoreResult<TData, TError, TQueryFnData>
export function useInfiniteQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TQueryFnData | TData>,
    options?: UseInfiniteQueryOptions<TData, TError, TQueryFnData>
): UseInfiniteQueryStoreResult<TData, TError, TQueryFnData>
export default function useInfiniteQuery<TData, TError, TQueryFnData = TData>(
    arg1: QueryKey | UseInfiniteQueryOptions<TData, TError, TQueryFnData>,
    arg2?:
        | QueryFunction<TQueryFnData | TData>
        | UseInfiniteQueryOptions<TData, TError, TQueryFnData>,
    arg3?: UseInfiniteQueryOptions<TData, TError, TQueryFnData>
): UseInfiniteQueryStoreResult<TData, TError, TQueryFnData> {
    const options = parseQueryArgs(arg1, arg2, arg3)
    const client: QueryClient = useQueryClient()
    const defaultedOptions = client.defaultQueryObserverOptions(options)
    const observer = new InfiniteQueryObserver<TData, TError, TQueryFnData>(client, defaultedOptions)

    const { subscribe } = readable(observer.getCurrentResult(), set => {
        return observer.subscribe(set)
    })

    function setOptions(options: UseInfiniteQueryOptions<TData, TError, TQueryFnData>)
    function setOptions(
        queryKey: QueryKey,
        options?: UseInfiniteQueryOptions<TData, TError, TQueryFnData>
    )
    function setOptions(
        queryKey: QueryKey,
        queryFn: QueryFunction<TQueryFnData | TData>,
        options?: UseInfiniteQueryOptions<TData, TError, TQueryFnData>
    )
    function setOptions(
        arg1: QueryKey | UseInfiniteQueryOptions<TData, TError, TQueryFnData>,
        arg2?:
            | QueryFunction<TData | TQueryFnData>
            | UseInfiniteQueryOptions<TData, TError, TQueryFnData>,
        arg3?: UseInfiniteQueryOptions<TData, TError, TQueryFnData>
    ) {
        if (observer.hasListeners()) {
            const options = parseQueryArgs(arg1, arg2, arg3)
            const defaultedOptions = client.defaultQueryObserverOptions(options)
            observer.setOptions(defaultedOptions)
        }
    }

    return { subscribe, setOptions }
}