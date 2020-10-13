<script lang="ts">
  import { onMount } from 'svelte'

  import type { QueryOptions } from '../types'
  import useQuery from './useQuery'

  export let options: QueryOptions
  // useful for binding
  export let queryResult

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
