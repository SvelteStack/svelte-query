import type {
  QueryObserver,
  UseBaseQueryOptions,
  UseQueryOptions,
  UseBaseQueryResult,
  QueryKey
} from 'react-query/types'
import type { Readable } from 'svelte/store'
import { useQueryClient } from './useQueryClient'
import { readable } from 'svelte/store'

export type UseQueryReturnType<
  TData,
  TError,
  TQueryFnData
> = Readable<UseBaseQueryResult<TData, TError>> & {
  updateOptions?: (
    options: Partial<UseQueryOptions<TQueryFnData, TError, TData>>
  ) => void
}

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
): UseQueryReturnType<TData, TError, TQueryFnData> {
  const queryClient = useQueryClient()
  const defaultedOptions = queryClient.defaultQueryObserverOptions(options)

  const observer = new Observer<TQueryFnData, TError, TData, TQueryData, TQueryKey>(queryClient, defaultedOptions)

  const currentResult = observer.getCurrentResult()

  const result = readable(currentResult, (set) => {
    return observer.subscribe(result => {
      // Update result to make sure we did not miss any query updates
      // between creating the observer and subscribing to it.
      observer.updateResult()

      set(result);
    });
  })

  const updateOptions = (
    options: Partial<UseQueryOptions<TQueryFnData, TError, TData>>
  ): void => {
    // const defaultedOptions = queryClient.defaultQueryObserverOptions(options)
    // @ts-expect-error something fishy in type-inference here. silence for now, @TODO
    observer.setOptions({ ...observer.options, ...options })

    // Update result to make sure we did not miss any query updates
    // between creating the observer and subscribing to it.
    observer.updateResult()
  }

  return { ...result, updateOptions }
}
