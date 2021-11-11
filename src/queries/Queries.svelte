<script lang="ts">
  import { onMount } from 'svelte'

  import type { UseQueryOptions, UseQueriesResult } from '../types'
  import useQueries from './useQueries'

  type TQueryFnData = $$Generic<any>
  type TError = $$Generic<any>
  type TData = $$Generic<TQueryFnData>
  type TQueryKey = $$Generic<QueryKey>

  type T =
    | readonly UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>[]
    | readonly [...UseQueryOptions[]]

  export let queries: T
  // useful for binding
  export let currentResult: UseQueriesResult<T> = []

  let firstRender = true

  onMount(() => {
    firstRender = false
  })

  const queriesStore = useQueries(queries)
  $: currentResult = $queriesStore

  $: {
    if (!firstRender) {
      queriesStore.setQueries(queries)
    }
  }
</script>

<slot name="queries" {currentResult} />
