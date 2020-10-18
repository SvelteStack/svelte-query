import type {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
} from './types'
import type { QueryClient } from './queryClient'
import { ObserverFetchOptions, QueryObserver } from './queryObserver'
import {
  hasNextPage,
  hasPreviousPage,
  infiniteQueryBehavior,
} from './infiniteQueryBehavior'

type InfiniteQueryObserverListener<TData, TError> = (
  result: InfiniteQueryObserverResult<TData, TError>
) => void

export class InfiniteQueryObserver<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData,
  TQueryData = TQueryFnData
  > extends QueryObserver<
  InfiniteData<TData>,
  TError,
  TQueryFnData,
  InfiniteData<TQueryData>
  > {

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    client: QueryClient,
    options: InfiniteQueryObserverOptions<
      TData,
      TError,
      TQueryFnData,
      TQueryData
    >
  ) {
    super(client, options)
  }

  protected init(
    options: InfiniteQueryObserverOptions<
      TData,
      TError,
      TQueryFnData,
      TQueryData
    >
  ) {
    this.fetchNextPage = this.fetchNextPage.bind(this)
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this)
    super.init(options)
  }

  subscribe(listener?: InfiniteQueryObserverListener<TData, TError>) {
    return super.subscribe(listener)
  }

  getCurrentResult() {
    return super.getCurrentResult() as InfiniteQueryObserverResult<TData, TError>
  }

  protected fetch(fetchOptions?: ObserverFetchOptions) {
    return super.fetch(fetchOptions) as Promise<InfiniteQueryObserverResult<TData, TError>>
  }

  setOptions(
    options?: InfiniteQueryObserverOptions<
      TData,
      TError,
      TQueryFnData,
      TQueryData
    >
  ): void {
    super.setOptions({
      ...options,
      behavior: infiniteQueryBehavior<TData, TError, TQueryFnData>(),
    })
  }

  fetchNextPage(
    options?: FetchNextPageOptions
  ): Promise<InfiniteQueryObserverResult<TData, TError>> {
    return this.fetch({
      cancelRefetch: true,
      throwOnError: options?.throwOnError,
      meta: {
        fetchMore: { direction: 'forward', pageParam: options?.pageParam },
      },
    })
  }

  fetchPreviousPage(
    options?: FetchPreviousPageOptions
  ): Promise<InfiniteQueryObserverResult<TData, TError>> {
    return this.fetch({
      cancelRefetch: true,
      throwOnError: options?.throwOnError,
      meta: {
        fetchMore: { direction: 'backward', pageParam: options?.pageParam },
      },
    })
  }

  protected getNewResult(
    willFetch?: boolean
  ): InfiniteQueryObserverResult<TData, TError> {
    const { state } = this.getCurrentQuery()
    const result = super.getNewResult(willFetch)
    return {
      ...result,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: hasNextPage(this.options, result.data?.pages),
      hasPreviousPage: hasPreviousPage(this.options, result.data?.pages),
      isFetchingNextPage:
        state.isFetching && state.fetchMeta?.fetchMore?.direction === 'forward',
      isFetchingPreviousPage:
        state.isFetching &&
        state.fetchMeta?.fetchMore?.direction === 'backward',
    }
  }
}
