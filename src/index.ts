// react-query/core
export {
  CancelledError,
  QueryCache,
  QueryClient,
  QueryObserver,
  QueriesObserver,
  InfiniteQueryObserver,
  MutationCache,
  MutationObserver,
  setLogger,
  notifyManager,
  focusManager,
  onlineManager,
  hashQueryKey,
  isError,
  isCancelledError,
} from 'react-query/core'

export type {
  UseQueryResult,
  UseInfiniteQueryResult
} from 'react-query/types';

// react-query/react port
// export { default as QueryClientProvider } from './QueryClientProvider.svelte';
export { useQueryClient } from './useQueryClient'
export { useIsFetching } from './useIsFetching'
export { useIsMutating } from './useIsMutating'
export { useMutation } from './useMutation'
export { useQuery } from './useQuery'
export { useQueries } from './useQueries'
export { useInfiniteQuery } from './useInfiniteQuery'

// react-query/hydrate
export { dehydrate, hydrate } from './hydration/hydration'

// react-query/hydrate/react port
export { useHydrate } from './hydration/useHydrate'
// export { default as Hydrate } from './hydration/Hydrate.svelte'
