import { QueriesObserver } from 'react-query/core'
import type {
  UseQueryOptions,
  UseQueryResult,
} from 'react-query/types'
import type { Readable } from 'svelte/store'
import { useQueryClient } from './useQueryClient'

export function useQueries(
  queries: UseQueryOptions[]
): Readable<UseQueryResult[]> {
  const queryClient = useQueryClient()
  const observer = new QueriesObserver(queryClient, queries)

  observer.setQueries(queries)

  return observer
}
