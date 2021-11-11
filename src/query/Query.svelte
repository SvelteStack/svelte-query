<script lang="ts">
  import { onMount } from 'svelte'

  import type { UseQueryOptions, UseQueryResult } from '../types'
  import type { QueryKey } from '../queryCore/core'
  import useQuery from './useQuery'

  type TQueryFnData = $$Generic<any>
  type TError = $$Generic<any>
  type TData = $$Generic<TQueryFnData>
  type TQueryKey = $$Generic<QueryKey>

  export let options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
  // useful for binding
  export let queryResult: UseQueryResult<TData, TError> | undefined = undefined

  let firstRender = true

  onMount(() => {
    firstRender = false
  })

  const query = useQuery(options)
  $: queryResult = $query

  $: {
    if (!firstRender) {
      query.setOptions(options)
    }
  }
</script>

<slot name="query" {queryResult} />
