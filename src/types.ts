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
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
  > extends Readable<UseQueryResult<TData, TError>> {
  setEnabled(enabled: boolean): void
  setOptions: {
    (options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>): any;
    (queryKey: TQueryKey, options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>): any;
    (queryKey: TQueryKey, queryFn: QueryFunction<TQueryFnData, TQueryKey>, options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>): any;
  }
  updateOptions(options: Partial<UseQueryOptions<TQueryFnData, TError, TData>>): void
}

// use options.infinite = true for infinite Query
export interface UseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
  >
  extends QueryObserverOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryFnData,
  TQueryKey
  > { }

export type UseQueryResult<TData = unknown, TError = unknown> = QueryObserverResult<TData, TError>

export interface UseInfiniteQueryStoreResult<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
  > extends Readable<UseInfiniteQueryResult<TData, TError>> {
  setEnabled(enabled: boolean): void
  setOptions: {
    (options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>): any;
    (queryKey: TQueryKey, options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>): any;
    (queryKey: TQueryKey, queryFn: QueryFunction<TQueryFnData, TQueryKey>, options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>): any;
  }
  updateOptions(options: Partial<UseInfiniteQueryOptions<TQueryFnData, TError, TData>>): void
}

export interface UseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
  >
  extends InfiniteQueryObserverOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey
  > { }


export type UseInfiniteQueryResult<TData = unknown, TError = unknown> = InfiniteQueryObserverResult<TData, TError>

// Avoid TS depth-limit error in case of large array literal
type MAXIMUM_DEPTH = 20

type GetOptions<T extends any> =
  // Part 1: responsible for applying explicit type parameter to function arguments, if object { queryFnData: TQueryFnData, error: TError, data: TData }
  T extends {
    queryFnData: infer TQueryFnData
    error?: infer TError
    data: infer TData
  }
    ? UseQueryOptions<TQueryFnData, TError, TData>
    : T extends { queryFnData: infer TQueryFnData; error?: infer TError }
    ? UseQueryOptions<TQueryFnData, TError>
    : T extends { data: infer TData; error?: infer TError }
    ? UseQueryOptions<unknown, TError, TData>
    : // Part 2: responsible for applying explicit type parameter to function arguments, if tuple [TQueryFnData, TError, TData]
    T extends [infer TQueryFnData, infer TError, infer TData]
    ? UseQueryOptions<TQueryFnData, TError, TData>
    : T extends [infer TQueryFnData, infer TError]
    ? UseQueryOptions<TQueryFnData, TError>
    : T extends [infer TQueryFnData]
    ? UseQueryOptions<TQueryFnData>
    : // Part 3: responsible for inferring and enforcing type if no explicit parameter was provided
    T extends {
        queryFn?: QueryFunction<infer TQueryFnData>
        select: (data: any) => infer TData
      }
    ? UseQueryOptions<TQueryFnData, unknown, TData>
    : T extends { queryFn?: QueryFunction<infer TQueryFnData> }
    ? UseQueryOptions<TQueryFnData>
    : // Fallback
      UseQueryOptions

type GetResults<T> =
  // Part 1: responsible for mapping explicit type parameter to function result, if object
  T extends { queryFnData: any; error?: infer TError; data: infer TData }
    ? UseQueryResult<TData, TError>
    : T extends { queryFnData: infer TQueryFnData; error?: infer TError }
    ? UseQueryResult<TQueryFnData, TError>
    : T extends { data: infer TData; error?: infer TError }
    ? UseQueryResult<TData, TError>
    : // Part 2: responsible for mapping explicit type parameter to function result, if tuple
    T extends [any, infer TError, infer TData]
    ? UseQueryResult<TData, TError>
    : T extends [infer TQueryFnData, infer TError]
    ? UseQueryResult<TQueryFnData, TError>
    : T extends [infer TQueryFnData]
    ? UseQueryResult<TQueryFnData>
    : // Part 3: responsible for mapping inferred type to results, if no explicit parameter was provided
    T extends {
        queryFn?: QueryFunction<any>
        select: (data: any) => infer TData
      }
    ? UseQueryResult<TData>
    : T extends { queryFn?: QueryFunction<infer TQueryFnData> }
    ? UseQueryResult<TQueryFnData>
    : // Fallback
      UseQueryResult

/**
 * QueriesOptions reducer recursively unwraps function arguments to infer/enforce type param
 */
export type QueriesOptions<
  T extends any[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = []
> = Depth['length'] extends MAXIMUM_DEPTH
  ? UseQueryOptions[]
  : T extends []
  ? []
  : T extends [infer Head]
  ? [...Result, GetOptions<Head>]
  : T extends [infer Head, ...infer Tail]
  ? QueriesOptions<[...Tail], [...Result, GetOptions<Head>], [...Depth, 1]>
  : unknown[] extends T
  ? T
  : // If T is *some* array but we couldn't assign unknown[] to it, then it must hold some known/homogenous type!
  // use this to infer the param types in the case of Array.map() argument
  T extends UseQueryOptions<infer TQueryFnData, infer TError, infer TData>[]
  ? UseQueryOptions<TQueryFnData, TError, TData>[]
  : // Fallback
    UseQueryOptions[]

/**
 * QueriesResults reducer recursively maps type param to results
 */
export type QueriesResults<
  T extends any[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = []
> = Depth['length'] extends MAXIMUM_DEPTH
  ? UseQueryResult[]
  : T extends []
  ? []
  : T extends [infer Head]
  ? [...Result, GetResults<Head>]
  : T extends [infer Head, ...infer Tail]
  ? QueriesResults<[...Tail], [...Result, GetResults<Head>], [...Depth, 1]>
  : T extends UseQueryOptions<infer TQueryFnData, infer TError, infer TData>[]
  ? // Dynamic-size (homogenous) UseQueryOptions array: map directly to array of results
    UseQueryResult<unknown extends TData ? TQueryFnData : TData, TError>[]
  : // Fallback
    UseQueryResult[]

export type UseQueriesResult<T extends  any[]> = QueriesResults<T>

export interface UseQueriesStoreResult<T extends  any[]> extends Readable<UseQueriesResult<T>> {
    setQueries(newQueries: readonly [...QueriesOptions<T>]): void
}

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
