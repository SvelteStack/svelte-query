import { useQueryClient } from '../useQueryClient'
import { hydrate } from './hydration'
import type { QueryClient } from 'react-query/core'
import type { DehydratedState, HydrateOptions } from './hydration'

export function useHydrate(state: DehydratedState, options?: HydrateOptions) {
  const client: QueryClient = useQueryClient()

  if (state) {
    hydrate(client, state, options)
  }
}
