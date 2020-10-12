<script lang="ts">
  import {
    QueryClientProvider,
  } from "../../src";
  import Mutation from "./Mutation.svelte"
</script>
  
<main>
  <QueryClientProvider>
    <Mutation />
  </QueryClientProvider>
</main>
