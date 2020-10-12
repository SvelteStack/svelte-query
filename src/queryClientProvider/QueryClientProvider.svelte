<script lang="ts">
  import { setContext, onMount, onDestroy } from 'svelte'

  import { QueryClient } from '../queryCore/core/queryClient'
  import { QueryCache } from '../queryCore/core/queryCache'

  // Props with default values
  export let cache = new QueryCache()
  export let client = new QueryClient({ cache })

  onMount(() => {
    client.mount()
  })

  setContext('queryClient', client)

  onDestroy(() => {
    client.unmount()
  })
</script>

<slot />
