/* eslint-disable no-shadow */
import type { QueryObserver } from 'react-query/core'
import type { QueryKey } from 'react-query/types/core/types'
import type {
  UseBaseQueryOptions,
  UseQueryResult,
} from 'react-query/types/react/types'
import type { Readable } from 'svelte/store'
import { useQueryClient } from './useQueryClient'
// import { notifyManager } from 'react-query/core';
import { readable } from 'svelte/store'

export type UseQueryReturnType<
  TData,
  TError,
  Result = UseQueryResult<TData, TError>
> = Readable<Result>

export function useBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>(
  options: UseBaseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
  Observer: typeof QueryObserver
): UseQueryReturnType<TData, TError> {
  const queryClient = useQueryClient()
  const defaultedOptions = queryClient.defaultQueryObserverOptions(options)
  const observer = new Observer<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >(queryClient, defaultedOptions)

  const result = observer.getCurrentResult()

  return readable(result, set => {
    const unsubscribe = observer.subscribe(result => {
      set(result)
    })

    return unsubscribe
  })
}
