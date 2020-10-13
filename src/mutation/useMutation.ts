import { readable } from 'svelte/store'

import type { QueryClient, MutationOptions } from '../queryCore/core'
import { getStatusProps, noop } from '../queryCore/core/utils'
import { useQueryClient } from '../queryClientProvider'
import type {
    MutationState,
    MutationAction,
    MutationFunction,
    MutateFunction,
    MutateAsyncFunction,
} from '../types'
import { getLogger } from '../queryCore/core/logger'
import { notifyManager } from '../queryCore/core/notifyManager'
import { reduce } from '../utils'

function getDefaultMutationState<TData, TError>(): MutationState<TData, TError> {
    return {
        ...getStatusProps('idle'),
        data: undefined,
        error: null,
    }
}

function mutationStateReducer<TData, TError>(
    state: MutationState<TData, TError>,
    action: MutationAction<TData, TError>
): MutationState<TData, TError> {
    switch (action.type) {
        case 'reset':
            return getDefaultMutationState()
        case 'loading':
            return {
                ...getStatusProps('loading'),
                data: undefined,
                error: null,
            }
        case 'success':
            return {
                ...getStatusProps('success'),
                data: action.data,
                error: null,
            }
        case 'error':
            return {
                ...getStatusProps('error'),
                data: undefined,
                error: action.error,
            }
        default:
            return state
    }
}

export default function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    mutationFn: MutationFunction<TData, TVariables>,
    options: MutationOptions<TData, TError, TVariables, TContext> = {}
) {
    const client: QueryClient = useQueryClient()
    const defaultedOptions = client.defaultMutationOptions(options)

    const initial = getDefaultMutationState<TData, TError>()
    const state = reduce<MutationState<TData, TError>, MutationAction<TData, TError>>(mutationStateReducer, initial)
    const dispatch = state.dispatch

    const safeDispatch = action => {
        notifyManager.schedule(() => {
            dispatch(action)
        })
    }

    let lastMutationIdRef = 0

    const mutateAsync: MutateAsyncFunction<
        TData,
        TError,
        TVariables,
        TContext
    > = (vars, mutateOpts = {}): Promise<TData> => {
        const mutationId = ++lastMutationIdRef
        const mutationOpts = defaultedOptions
        const lastMutationFn = mutationFn

        let ctx: TContext | undefined
        let data: TData

        safeDispatch({ type: 'loading' })

        return Promise.resolve()
            .then(() => mutationOpts.onMutate?.(vars))
            .then(context => {
                ctx = context
            })
            .then(() => lastMutationFn(vars))
            .then(result => {
                data = result
            })
            .then(() => mutationOpts.onSuccess?.(data, vars, ctx))
            .then(() => mutationOpts.onSettled?.(data, null, vars, ctx))
            .then(() => mutateOpts.onSuccess?.(data, vars, ctx))
            .then(() => mutateOpts.onSettled?.(data, null, vars, ctx))
            .then(() => {
                if (lastMutationIdRef === mutationId) {
                    safeDispatch({ type: 'success', data })
                }
                return data
            })
            .catch(error => {
                getLogger().error(error)
                return Promise.resolve()
                    .then(() => mutationOpts.onError?.(error, vars, ctx))
                    .then(() => mutationOpts.onSettled?.(undefined, error, vars, ctx))
                    .then(() => mutateOpts.onError?.(error, vars, ctx))
                    .then(() => mutateOpts.onSettled?.(undefined, error, vars, ctx))
                    .then(() => {
                        if (lastMutationIdRef === mutationId) {
                            safeDispatch({ type: 'error', error })
                        }
                        throw error
                    })
            })
    }

    const mutate: MutateFunction<TData, TError, TVariables, TContext> = (
        variables,
        mutateOptions
    ) => {
        mutateAsync(variables, mutateOptions).catch(noop)
    }

    const reset = () => {
        safeDispatch({ type: 'reset' })
    }

    const initialResult = {
        ...initial,
        mutate,
        mutateAsync,
        reset,
    }

    const { subscribe } = readable(initialResult, set => {
        return state.subscribe(newState => {
            set({
                ...newState,
                mutate,
                mutateAsync,
                reset,
            })
        })
    })

    return { subscribe }
}