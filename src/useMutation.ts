import { MutationObserver } from 'react-query/core'
import type {
  MutationFunction,
  MutationKey,
  MutationObserverResult,
} from 'react-query/types/core'
import type {
  UseMutationOptions,
  UseMutateFunction,
  UseMutateAsyncFunction,
} from 'react-query/types/react/types'
import { Readable, writable } from 'svelte/store'
import { useQueryClient } from './useQueryClient'
import { noop, parseMutationArgs } from './utils'

type MutationResult<TData, TError, TVariables, TContext> = Omit<
  MutationObserverResult<TData, TError, TVariables, TContext>,
  'mutate' | 'mutateAsyc'
>

export type UseMutationReturnType<
  TData,
  TError,
  TVariables,
  TContext,
  Result = MutationResult<TData, TError, TVariables, TContext>
> = Readable<
  Result & {
    mutate: UseMutateFunction<TData, TError, TVariables, TContext>
    mutateAsync: UseMutateAsyncFunction<TData, TError, TVariables, TContext>
  }
>

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
  const observer = new MutationObserver<TData, TError, TVariables, TContext>(
    queryClient,
    options
  )

  const currentResult = observer.getCurrentResult()

  const state = writable(currentResult)

  observer.subscribe(() => {
    state.set(observer.getCurrentResult())
  })

  const mutate: UseMutateFunction<TData, TError, TVariables, TContext> = (
    variables,
    mutateOptions = {}
  ) => {
    observer.mutate(variables, mutateOptions).catch(noop)
  }

  return {
    ...state,
    mutate,
    mutateAsync: currentResult.mutate,
  }
}
