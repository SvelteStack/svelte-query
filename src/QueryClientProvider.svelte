<script lang="ts">
  import { setContext, onDestroy } from "svelte";

  import { QueryCache } from "./query/core/queryCache";
  import { QueryClient } from "./query/core/queryClient";

  // Props with default values
  export let cache = new QueryCache();
  export let client = new QueryClient({ cache });

  client.mount();

  setContext("queryClient", client);

  onDestroy(() => {
    client.unmount();
  });
</script>

<slot />
