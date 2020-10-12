<script lang="ts">
  import { onMount } from 'svelte'

  import type { QueryOptions } from '../types'
  import useQueries from './useQueries'

  export let queries: QueryOptions[]
  export let currentResult

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
