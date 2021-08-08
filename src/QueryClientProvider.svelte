<script lang="ts">
    import { setContext, onMount, onDestroy } from 'svelte'
    import { QueryClient } from 'react-query/core'

    export let client = new QueryClient()

    onMount(() => {
      client.mount()
    })

    setContext('queryClient', client)

    onDestroy(() => {
      client.unmount()
    })
  </script>
  
  <slot />