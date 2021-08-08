import type { MutationFilters } from 'react-query/types/core/utils'
import type { Readable } from 'svelte/store'
import { readable } from 'svelte/store'
import type { QueryClient, QueryKey } from 'react-query/types'
import { useQueryClient } from './useQueryClient'
import { parseMutationFilterArgs } from "./utils"

export function useIsMutating(filters?: MutationFilters): Readable<number>
export function useIsMutating(
  queryKey?: QueryKey,
  filters?: MutationFilters
): Readable<number>
export function useIsMutating(
  arg1?: QueryKey | MutationFilters,
  arg2?: MutationFilters
): Readable<number> {
  const filters = parseMutationFilterArgs(arg1, arg2)
  const queryClient: QueryClient = useQueryClient()
  const cache = queryClient.getMutationCache()

  let isMutating = queryClient.isMutating(filters)

  return readable(isMutating, set => cache.subscribe(() => {
    set(queryClient.isMutating(filters));
  }))
}
