<script lang="ts">
  import {
    QueryClientProvider,
  } from "../../src";
  import IsFetching from "./IsFetching.svelte"
</script>
  
<main>
  <QueryClientProvider>
    <IsFetching />
  </QueryClientProvider>

</main>
  