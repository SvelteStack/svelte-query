import type { Readable } from "svelte/store";
import type {
  MutateOptions,
  QueryObserverOptions,
  QueryObserverResult,
  QueryFunction, QueryKey, MutationStatus, MutationKey, MutationFunction,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult
} from "./queryCore";
import { RetryDelayValue, RetryValue } from "./queryCore/core/retryer";


export interface UseQueryStoreResult<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData
  > extends Readable<UseQueryResult<TData, TError>> {
  setOptions: {
    (options: UseQueryOptions<TData, TError, TQueryFnData>): any;
    (queryKey: QueryKey, options?: UseQueryOptions<TData, TError, TQueryFnData>): any;
    (queryKey: QueryKey, queryFn: QueryFunction<TQueryFnData | TData>, options?: UseQueryOptions<TData, TError, TQueryFnData>): any;
  }
}

// use options.infinite = true for infinite Query
export interface UseQueryOptions<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData,
  TQueryData = TQueryFnData
  > extends QueryObserverOptions<TData, TError, TQueryFnData, TQueryData> { }

export interface UseQueryResult<TData = unknown, TError = unknown>
  extends QueryObserverResult<TData, TError> { }


export interface UseInfiniteQueryStoreResult<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData
  > extends Readable<UseInfiniteQueryResult<TData, TError>> {
  setOptions: {
    (options: UseInfiniteQueryOptions<TData, TError, TQueryFnData>): any;
    (queryKey: QueryKey, options?: UseInfiniteQueryOptions<TData, TError, TQueryFnData>): any;
    (queryKey: QueryKey, queryFn: QueryFunction<TQueryFnData | TData>, options?: UseInfiniteQueryOptions<TData, TError, TQueryFnData>): any;
  }
}

export interface UseInfiniteQueryOptions<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData,
  TQueryData = TQueryFnData
  >
  extends InfiniteQueryObserverOptions<
  TData,
  TError,
  TQueryFnData,
  TQueryData
  > { }

export interface UseInfiniteQueryResult<TData = unknown, TError = unknown>
  extends InfiniteQueryObserverResult<TData, TError> { }


export interface MutationStoreResult<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
  > extends Readable<UseMutationResult<TData, TError, TVariables, TContext>> {
  setOptions: {
    (options: UseMutationOptions<TData, TError, TVariables, TContext>): any;
    (mutationKey: MutationKey, options?: UseMutationOptions<TData, TError, TVariables, TContext>): any;
    (mutationKey: MutationKey, mutationFn?: MutationFunction<TData, TVariables>, options?: UseMutationOptions<TData, TError, TVariables, TContext>): any;
    (mutationFn?: MutationFunction<TData, TVariables>, options?: UseMutationOptions<TData, TError, TVariables, TContext>): any;
  }
}

export interface UseMutationOptions<TData, TError, TVariables, TContext> {
  mutationKey?: string | unknown[]
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<void> | void
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<void> | void
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<void> | void
  retry?: RetryValue<TError>
  retryDelay?: RetryDelayValue
  useErrorBoundary?: boolean
}

export type UseMutateFunction<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
  > = (
    variables: TVariables,
    options?: MutateOptions<TData, TError, TVariables, TContext>
  ) => void

export type UseMutateAsyncFunction<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
  > = (
    variables: TVariables,
    options?: MutateOptions<TData, TError, TVariables, TContext>
  ) => Promise<TData>

export interface UseMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
  > {
  context: TContext | undefined
  data: TData | undefined
  error: TError | null
  failureCount: number
  isError: boolean
  isIdle: boolean
  isLoading: boolean
  isPaused: boolean
  isSuccess: boolean
  mutate: UseMutateFunction<TData, TError, TVariables, TContext>
  mutateAsync: UseMutateAsyncFunction<TData, TError, TVariables, TContext>
  reset: () => void
  status: MutationStatus
  variables: TVariables | undefined
}
