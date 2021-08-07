// import { onUnmounted, Ref, ref } from 'vue-demi';

import { notifyManager } from 'react-query/core'
import type { MutationFilters } from 'react-query/types/core/utils'
import type { Readable } from 'svelte/store'
import { readable } from 'svelte/store'
import type { QueryClient } from '.'
import { useQueryClient } from './useQueryClient'

export function useIsMutating(filters?: MutationFilters): Readable<number> {
  const client: QueryClient = useQueryClient()
  const cache = client.getMutationCache()
  // isMutating is the prev value initialized on mount *
  let isMutating = client.isMutating(filters)

  const { subscribe } = readable(isMutating, set => {
    return cache.subscribe(
      notifyManager.batchCalls(() => {
        const newIisMutating = client.isMutating(filters)

        if (isMutating !== newIisMutating) {
          // * and update with each change
          isMutating = newIisMutating

          set(isMutating)
        }
      })
    )
  })

  return { subscribe }
}
