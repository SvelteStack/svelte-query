import { QueryObserver } from 'react-query/core'
import type { UseQueryOptions, QueryFunction, QueryKey } from 'react-query/types'
import type { UseQueryReturnType } from './useBaseQuery'
import { useBaseQuery } from './useBaseQuery'
import { parseQueryArgs } from './utils'

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  options: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError, TQueryFnData>
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  options?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError, TQueryFnData>
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError, TQueryFnData>
export function useQuery<TQueryFnData, TError, TData = TQueryFnData>(
  arg1: QueryKey | UseQueryOptions<TQueryFnData, TError, TData>,
  arg2?:
    | QueryFunction<TQueryFnData>
    | UseQueryOptions<TQueryFnData, TError, TData>,
  arg3?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError, TQueryFnData> {
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3)

  return useBaseQuery(parsedOptions, QueryObserver)
}
