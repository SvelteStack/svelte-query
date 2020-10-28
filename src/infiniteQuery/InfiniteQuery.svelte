<script lang="ts">
  import { onMount } from 'svelte'

  import type {
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
  } from '../types'
  import useInfiniteQuery from './useInfiniteQuery'

  export let options: UseInfiniteQueryOptions
  // useful for binding
  export let queryResult: UseInfiniteQueryResult

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
