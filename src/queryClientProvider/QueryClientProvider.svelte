<script lang="ts">
  import { setContext, onMount, onDestroy } from 'svelte'

  import {
    DefaultOptions,
    MutationCache,
    QueryCache,
    QueryClient,
  } from '../queryCore'

  // Props with default values
  export let queryCache = new QueryCache()
  export let mutationCache = new MutationCache()
  export let defaultOptions: DefaultOptions
  export let client = new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions,
  })

  onMount(() => {
    client.mount()
  })

  setContext('queryClient', client)

  onDestroy(() => {
    client.unmount()
  })
</script>

<slot />
