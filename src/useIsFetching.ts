import type { QueryKey } from 'react-query/types'
import type { QueryFilters } from 'react-query/types/core/utils'
import type { Readable } from 'svelte/store'
import { readable } from 'svelte/store'
import { useQueryClient } from './useQueryClient'
import { parseFilterArgs } from './utils'

export function useIsFetching(filters?: QueryFilters): Readable<number>
export function useIsFetching(
  queryKey?: QueryKey,
  filters?: QueryFilters
): Readable<number>
export function useIsFetching(
  arg1?: QueryKey | QueryFilters,
  arg2?: QueryFilters
): Readable<number> {
  const queryClient = useQueryClient()
  const cache = queryClient.getQueryCache()

  const [filters] = parseFilterArgs(arg1, arg2)

  let isFetching = queryClient.isFetching(filters)

  return readable(isFetching, set => cache.subscribe(() => {
    set(queryClient.isFetching(filters));
  }))
}
