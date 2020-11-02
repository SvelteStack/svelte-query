<script lang="ts">
  import { onMount } from 'svelte'

  import type { UseQueryOptions, UseQueryResult } from '../types'
  import useQuery from './useQuery'

  export let options: UseQueryOptions
  // useful for binding
  export let queryResult: UseQueryResult

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
