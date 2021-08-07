import type { QueryClient } from 'react-query/core'
import { queryClient } from './queryClientStore'
import { get } from 'svelte/store'

export function useQueryClient(): QueryClient {
  return get(queryClient)
}
