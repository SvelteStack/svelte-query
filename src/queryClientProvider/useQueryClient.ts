import { getContext } from 'svelte'

import { QueryClient } from '../queryCore/core/queryClient'

export default function useQueryClient(): QueryClient {
  const queryClient: QueryClient =  getContext('queryClient')
  if (!queryClient) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one')
  }
  return queryClient
}