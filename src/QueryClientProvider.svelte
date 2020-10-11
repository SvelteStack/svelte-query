<script context="module" lang="ts">
  import { getContext } from "svelte";

  import { QueryClient } from "./query/core/queryClient";

  export function useQueryClient(): QueryClient {
    return getContext("queryClient")
  }
</script>

<script lang="ts">
  import { setContext, onMount, onDestroy } from "svelte";

  import { QueryCache } from "./query/core/queryCache";

  // Props with default values
  export let cache = new QueryCache();
  export let client = new QueryClient({ cache });
  
  onMount(()=>{
    client.mount();
  })

  setContext("queryClient", client);

  onDestroy(() => {
    client.unmount();
  });
</script>

<slot />
