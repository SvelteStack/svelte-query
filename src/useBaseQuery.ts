import type {
  QueryObserver,
  QueryKey,
  UseBaseQueryOptions,
  UseQueryOptions,
  UseBaseQueryResult,
} from 'react-query/types'
import type { Readable } from 'svelte/store'
import { useQueryClient } from './useQueryClient'
import { readable } from 'svelte/store'

export type UseQueryReturnType<
  TData,
  TError,
  Result = UseBaseQueryResult<TData, TError>
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
) {
  const queryClient = useQueryClient()
  const defaultedOptions = queryClient.defaultQueryObserverOptions(options)

  let observer = new Observer(queryClient, defaultedOptions)

  let currentResult = observer.getCurrentResult()

  let result = readable(currentResult, (set) => {
    return observer.subscribe(result => {
      // Update result to make sure we did not miss any query updates
      // between creating the observer and subscribing to it.
      observer.updateResult()

      set(result);
    });
  })

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
