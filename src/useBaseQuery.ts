/* eslint-disable no-shadow */
import type { QueryObserver } from 'react-query/core'
import type { QueryKey } from 'react-query/types/core/types'
import type {
  UseBaseQueryOptions,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query/types/react/types'
import type { Readable } from 'svelte/store'
import { useQueryClient } from './useQueryClient'
import { notifyManager } from 'react-query/core'
import { readable } from 'svelte/store'

export type UseQueryReturnType<
  TData,
  TError,
  Result = UseQueryResult<TData, TError>
> = Readable<
  Result & {
    updateOptions: (
      options: Partial<UseQueryOptions<unknown, TError, TData, unknown[]>>
    ) => void
  }
>

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

  // Make sure results are optimistically set in fetching state before subscribing or updating options
  defaultedOptions.optimisticResults = true

  // Include callbacks in batch renders
  if (defaultedOptions.onError) {
    defaultedOptions.onError = notifyManager.batchCalls(
      defaultedOptions.onError
    )
  }

  if (defaultedOptions.onSuccess) {
    defaultedOptions.onSuccess = notifyManager.batchCalls(
      defaultedOptions.onSuccess
    )
  }

  if (defaultedOptions.onSettled) {
    defaultedOptions.onSettled = notifyManager.batchCalls(
      defaultedOptions.onSettled
    )
  }

  let observer = new Observer<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >(queryClient, defaultedOptions)

  let currentResult = observer.getOptimisticResult(defaultedOptions)

  let result = readable(currentResult, set => {
    if (!observer) observer = new Observer(queryClient, defaultedOptions)
    set(observer.getCurrentResult())
    return observer.subscribe(set)
  })

  // Handle result property usage tracking
  if (defaultedOptions.notifyOnChangeProps === 'tracked') {
    currentResult = observer.trackResult(currentResult)
  }

  const updateOptions = (
    options: Partial<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
  ): void => {
    // const defaultedOptions = queryClient.defaultQueryObserverOptions(options)
    observer.setOptions({ ...observer.options, ...options })

    // Update result to make sure we did not miss any query updates
    // between creating the observer and subscribing to it.
    observer.updateResult()
  }

  return { ...result, updateOptions }
}
