import { readable } from 'svelte/store'
import type { Readable } from "svelte/store";

import { notifyManager, QueryClient } from '../queryCore/core'
import { useQueryClient } from '../queryClientProvider'
import type { MutationFilters } from '../queryCore/core/utils'

export default function useIsMutating(filters?: MutationFilters): Readable<number> {
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
            }))
    })

    return { subscribe }
}