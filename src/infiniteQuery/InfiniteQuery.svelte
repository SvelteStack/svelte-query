<script lang="ts">
  import { onMount } from 'svelte'

  import type {
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
  } from '../types'
  import useInfiniteQuery from './useInfiniteQuery'

  type TQueryFnData = $$Generic<any>
  type TError = $$Generic<any>
  type TData = $$Generic<TQueryFnData>
  type TQueryData = $$Generic<TQueryFnData>
  type TQueryKey = $$Generic<QueryKey>

  export let options: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >
  // useful for binding
  export let queryResult:
    | UseInfiniteQueryResult<TData, TError>
    | undefined = undefined

  let firstRender = true

  onMount(() => {
    firstRender = false
  })

  const query = useInfiniteQuery(options)
  $: queryResult = $query

  $: {
    if (!firstRender) {
      query.setOptions(options)
    }
  }
</script>

<slot name="query" {queryResult} />
