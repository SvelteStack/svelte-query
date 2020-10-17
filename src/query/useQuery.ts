/* eslint-disable no-shadow */
import { readable } from 'svelte/store'

import { QueryClient, QueryFunction, QueryKey, QueryObserver } from '../queryCore/core'
import { parseQueryArgs } from '../queryCore/core/utils'
import { useQueryClient } from '../queryClientProvider'
import type { QueryOptions, QueryStoreResult } from '../types'

export function useQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
>(options: QueryOptions<TData, TError, TQueryFnData>): QueryStoreResult<TData, TError, TQueryFnData>
export function useQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
>(queryKey: QueryKey, options?: QueryOptions<TData, TError, TQueryFnData>): QueryStoreResult<TData, TError, TQueryFnData>
export function useQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TQueryFnData | TData>,
    options?: QueryOptions<TData, TError, TQueryFnData>
): QueryStoreResult<TData, TError, TQueryFnData>
export default function useQuery<TData = unknown, TError = unknown, TQueryFnData = TData>(
    arg1: QueryKey | QueryOptions<TData, TError, TQueryFnData>,
    arg2?:
        | QueryFunction<TData | TQueryFnData>
        | QueryOptions<TData, TError, TQueryFnData>,
    arg3?: QueryOptions<TData, TError, TQueryFnData>
): QueryStoreResult<TData, TError, TQueryFnData> {
    const options = parseQueryArgs(arg1, arg2, arg3)
    const client: QueryClient = useQueryClient()
    const defaultedOptions = client.defaultQueryObserverOptions(options)
    const observer = new QueryObserver<TData, TError, TQueryFnData>(client, defaultedOptions)

    const { subscribe } = readable(observer.getCurrentResult(), set => {
        return observer.subscribe(set)
    })

    function setOptions(options: QueryOptions<TData, TError, TQueryFnData>)
    function setOptions(
        queryKey: QueryKey,
        options?: QueryOptions<TData, TError, TQueryFnData>
    )
    function setOptions(
        queryKey: QueryKey,
        queryFn: QueryFunction<TQueryFnData | TData>,
        options?: QueryOptions<TData, TError, TQueryFnData>
    )
    function setOptions(
        arg1: QueryKey | QueryOptions<TData, TError, TQueryFnData>,
        arg2?:
            | QueryFunction<TData | TQueryFnData>
            | QueryOptions<TData, TError, TQueryFnData>,
        arg3?: QueryOptions<TData, TError, TQueryFnData>
    ) {
        const options = parseQueryArgs(arg1, arg2, arg3)
        const defaultedOptions = client.defaultQueryObserverOptions(options)
        observer.setOptions(defaultedOptions)
    }

    return { subscribe, setOptions }
}