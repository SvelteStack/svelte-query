import { notifyManager } from 'react-query/core'
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

  // isFetching is the prev value initialized on mount *
  let isFetching = queryClient.isFetching(filters)

  const { subscribe } = readable(isFetching, set => {
    return cache.subscribe(
      notifyManager.batchCalls(() => {
        const newIsFetching = queryClient.isFetching(filters)

        if (isFetching !== newIsFetching) {
          // * and update with each change
          isFetching = newIsFetching

          set(isFetching)
        }
      })
    )
  })

  return { subscribe }
}
