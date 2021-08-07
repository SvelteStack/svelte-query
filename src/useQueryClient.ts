import type { QueryClient } from 'react-query/core'
// import { getContext } from 'svelte';
import { queryClient } from './queryClientStore'

export function useQueryClient(): QueryClient {
  // const queryClient: QueryClient = getContext('queryClient');

  if (!queryClient) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one')
  }

  return queryClient
}
