import type { QueryClient } from '../core/queryClient'
import type { Query, QueryState } from '../core/query'
import type {
  MutationKey,
  MutationOptions,
  QueryKey,
  QueryOptions,
} from '../core/types'
import type { Mutation, MutationState } from '../core/mutation'

// TYPES

export interface DehydrateOptions {
  dehydrateMutations?: boolean
  dehydrateQueries?: boolean
  shouldDehydrateMutation?: ShouldDehydrateMutationFunction
  shouldDehydrateQuery?: ShouldDehydrateQueryFunction
}

export interface HydrateOptions {
  defaultOptions?: {
    queries?: QueryOptions
    mutations?: MutationOptions
  }
}

interface DehydratedMutation {
  mutationKey?: MutationKey
  state: MutationState
}

interface DehydratedQuery {
  cacheTime: number
  queryHash: string
  queryKey: QueryKey
  state: QueryState
}

export interface DehydratedState {
  mutations: DehydratedMutation[]
  queries: DehydratedQuery[]
}

export type ShouldDehydrateQueryFunction = (query: Query) => boolean

export type ShouldDehydrateMutationFunction = (mutation: Mutation) => boolean

// FUNCTIONS

function serializePositiveNumber(value: number): number {
  return value === Infinity ? -1 : value
}

function deserializePositiveNumber(value: number): number {
  return value === -1 ? Infinity : value
}

function dehydrateMutation(mutation: Mutation): DehydratedMutation {
  return {
    mutationKey: mutation.options.mutationKey,
    state: mutation.state,
  }
}

// Most config is not dehydrated but instead meant to configure again when
// consuming the de/rehydrated data, typically with useQuery on the client.
// Sometimes it might make sense to prefetch data on the server and include
// in the html-payload, but not consume it on the initial render.
function dehydrateQuery(query: Query): DehydratedQuery {
  return {
    cacheTime: serializePositiveNumber(query.cacheTime),
    state: query.state,
    queryKey: query.queryKey,
    queryHash: query.queryHash,
  }
}

function defaultShouldDehydrateMutation(mutation: Mutation) {
  return mutation.state.isPaused
}

function defaultShouldDehydrateQuery(query: Query) {
  return query.state.status === 'success'
}

export function dehydrate(
  client: QueryClient,
  options?: DehydrateOptions
): DehydratedState {
  options = options || {}

  const mutations: DehydratedMutation[] = []
  const queries: DehydratedQuery[] = []

  if (options?.dehydrateMutations !== false) {
    const shouldDehydrateMutation =
      options.shouldDehydrateMutation || defaultShouldDehydrateMutation

    client
      .getMutationCache()
      .getAll()
      .forEach(mutation => {
        if (shouldDehydrateMutation(mutation)) {
          mutations.push(dehydrateMutation(mutation))
        }
      })
  }

  if (options?.dehydrateQueries !== false) {
    const shouldDehydrateQuery =
      options.shouldDehydrateQuery || defaultShouldDehydrateQuery

    client
      .getQueryCache()
      .getAll()
      .forEach(query => {
        if (shouldDehydrateQuery(query)) {
          queries.push(dehydrateQuery(query))
        }
      })
  }

  return { mutations, queries }
}

export function hydrate(
  client: QueryClient,
  dehydratedState: unknown,
  options?: HydrateOptions
): void {
  if (typeof dehydratedState !== 'object' || dehydratedState === null) {
    return
  }

  const mutationCache = client.getMutationCache()
  const queryCache = client.getQueryCache()

  const mutations = (dehydratedState as DehydratedState).mutations || []
  const queries = (dehydratedState as DehydratedState).queries || []

  mutations.forEach(dehydratedMutation => {
    mutationCache.build(
      client,
      {
        ...options?.defaultOptions?.mutations,
        mutationKey: dehydratedMutation.mutationKey,
      },
      dehydratedMutation.state
    )
  })

  queries.forEach(dehydratedQuery => {
    const query = queryCache.get(dehydratedQuery.queryHash)

    // Do not hydrate if an existing query exists with newer data
    if (query) {
      if (query.state.updatedAt < dehydratedQuery.state.updatedAt) {
        query.setState(dehydratedQuery.state)
      }
      return
    }

    // Restore query
    queryCache.build(
      client,
      {
        ...options?.defaultOptions?.queries,
        queryKey: dehydratedQuery.queryKey,
        queryHash: dehydratedQuery.queryHash,
        cacheTime: deserializePositiveNumber(dehydratedQuery.cacheTime),
      },
      dehydratedQuery.state
    )
  })
}
