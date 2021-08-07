import {
  MutationObserver,
  MutationObserverResult,
  notifyManager,
} from 'react-query/core'
import type { MutationFunction, MutationKey } from 'react-query/types/core'
import type {
  UseMutateFunction,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query/types/react/types'
import type { Readable } from 'svelte/store'
import { readable } from 'svelte/store'
import { useQueryClient } from './useQueryClient'
import { noop, parseMutationArgs } from './utils'

type MutationResult<TData, TError, TVariables, TContext> = Omit<
  MutationObserverResult<TData, TError, TVariables, TContext>,
  'mutate'
>

export type UseMutationReturnType<
  TData,
  TError,
  TVariables,
  TContext,
  Result = MutationResult<TData, TError, TVariables, TContext>
> = Readable<Readonly<Result>> & {
  mutate: UseMutateFunction<TData, TError, TVariables, TContext>
}

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext>
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext>
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext>
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext>
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  arg1:
    | MutationKey
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg2?:
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext> {
  const options = parseMutationArgs(arg1, arg2, arg3)
  const queryClient = useQueryClient()
  const observer = new MutationObserver(queryClient, options)

  /**  */
  const mutate: UseMutateFunction<TData, TError, TVariables, TContext> = (
    variables,
    mutateOptions
  ) => {
    observer.mutate(variables, mutateOptions).catch(noop)
  }
  const initialResult = observer.getCurrentResult()
  const initialMutationResult: UseMutationResult<
    TData,
    TError,
    TVariables,
    TContext
  > = {
    ...initialResult,
    mutate,
    mutateAsync: initialResult.mutate,
  }

  const store = readable(initialMutationResult, set => {
    return observer.subscribe(
      notifyManager.batchCalls(
        (
          result: MutationObserverResult<TData, TError, TVariables, TContext>
        ) => {
          // Check if the component is still mounted
          if (observer.hasListeners()) {
            set({ ...result, mutate, mutateAsync: result.mutate })
          }
        }
      )
    )
  })

  return {
    ...store,
    mutate,
  }
}
