<script lang="ts">
  import { setContext, onMount, onDestroy } from 'svelte'

  import { MutationCache, QueryCache, QueryClient } from '../queryCore'

  // Props with default values
  export let queryCache = new QueryCache()
  export let mutationCache = new MutationCache()
  export let client = new QueryClient({ queryCache, mutationCache })

  onMount(() => {
    client.mount()
  })

  setContext('queryClient', client)

  onDestroy(() => {
    client.unmount()
  })
</script>

<slot />
