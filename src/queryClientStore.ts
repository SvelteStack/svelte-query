import type { DefaultOptions } from 'react-query/core'
import { MutationCache, QueryCache, QueryClient } from 'react-query/core'

// Props with default values
export const queryCache = new QueryCache()
export const mutationCache = new MutationCache()
export const defaultOptions: DefaultOptions = {}
export const client = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions,
})

client.mount()

export const queryClient = client
