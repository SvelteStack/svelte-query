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
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
  > extends Readable<UseQueryResult<TData, TError>> {
  setOptions: {
    (options: UseQueryOptions<TQueryFnData, TError, TData>): any;
    (queryKey: QueryKey, options?: UseQueryOptions<TQueryFnData, TError, TData>): any;
    (queryKey: QueryKey, queryFn: QueryFunction<TQueryFnData>, options?: UseQueryOptions<TQueryFnData, TError, TData>): any;
  }
  setEnabled(enabled: boolean): void
}

// use options.infinite = true for infinite Query
export interface UseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData
  > extends QueryObserverOptions<TQueryFnData, TError, TData, TQueryData> { }

export type UseQueryResult<TData = unknown, TError = unknown> = QueryObserverResult<TData, TError>


export interface UseInfiniteQueryStoreResult<
TQueryFnData = unknown,
TError = unknown,
TData = TQueryFnData,
  > extends Readable<UseInfiniteQueryResult<TData, TError>> {
  setOptions: {
    (options: UseInfiniteQueryOptions<TQueryFnData, TError, TData>): any;
    (queryKey: QueryKey, options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>): any;
    (queryKey: QueryKey, queryFn: QueryFunction<TQueryFnData>, options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>): any;
  }
  setEnabled(enabled: boolean): void
}

export interface UseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData
  >
  extends InfiniteQueryObserverOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryData
  > { }

export type UseInfiniteQueryResult<TData = unknown, TError = unknown> = InfiniteQueryObserverResult<TData, TError>


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
  retryDelay?: RetryDelayValue<TError>
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
