/* eslint-disable no-shadow */
import { readable } from 'svelte/store'

import { useQueryClient } from '../queryClientProvider'
import { noop, parseMutationArgs } from '../queryCore/core/utils'
import { MutationObserver } from '../queryCore/core/mutationObserver'
import { MutationFunction, MutationKey, MutationObserverResult } from '../queryCore/core/types'
import { notifyManager } from '../queryCore'
import type {
    MutationStoreResult,
    UseMutateFunction,
    UseMutationOptions,
    UseMutationResult,
} from '../types'

export function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>
): MutationStoreResult<TData, TError, TVariables, TContext>
export function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
): MutationStoreResult<TData, TError, TVariables, TContext>
export function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    mutationKey: MutationKey,
    options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationKey'>
): MutationStoreResult<TData, TError, TVariables, TContext>
export function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    mutationKey: MutationKey,
    mutationFn?: MutationFunction<TData, TVariables>,
    options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationKey' | 'mutationFn'>
): MutationStoreResult<TData, TError, TVariables, TContext>
export default function useMutation<
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
): MutationStoreResult<TData, TError, TVariables, TContext> {
    const options = parseMutationArgs(arg1, arg2, arg3)

    const queryClient = useQueryClient()

    const observer = new MutationObserver(queryClient, options)

    const mutate: UseMutateFunction<TData, TError, TVariables, TContext> = (variables, mutateOptions) => {
        observer.mutate(variables, mutateOptions).catch(noop)
    }
    const initialResult = observer.getCurrentResult()
    const initialMutationResult: UseMutationResult<TData, TError, TVariables, TContext> = { ...initialResult, mutate, mutateAsync: initialResult.mutate }

    const { subscribe } = readable(initialMutationResult, set => {
        return observer.subscribe(notifyManager.batchCalls(
            (
                result: MutationObserverResult<TData, TError, TVariables, TContext>
            ) => {
                // Check if the component is still mounted
                if (observer.hasListeners()) {
                    set({ ...result, mutate, mutateAsync: result.mutate })
                }
            }
        ))
    })

    function setOptions(options: UseMutationOptions<TData, TError, TVariables, TContext>)
    function setOptions(
        mutationKey: MutationKey,
        options?: UseMutationOptions<TData, TError, TVariables, TContext>
    )
    function setOptions(
        mutationKey: MutationKey,
        mutationFn?: MutationFunction<TData, TVariables>,
        options?: UseMutationOptions<TData, TError, TVariables, TContext>
    )
    function setOptions(
        mutationFn: MutationFunction<TData, TVariables>,
        options?: UseMutationOptions<TData, TError, TVariables, TContext>
    )
    function setOptions(
        arg1:
            | MutationKey
            | MutationFunction<TData, TVariables>
            | UseMutationOptions<TData, TError, TVariables, TContext>,
        arg2?:
            | MutationFunction<TData, TVariables>
            | UseMutationOptions<TData, TError, TVariables, TContext>,
        arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
    ) {
        if (observer.hasListeners()) {
            const newOptions = parseMutationArgs(arg1, arg2, arg3)
            observer.setOptions(newOptions)
        }
    }

    return { subscribe, setOptions }
}