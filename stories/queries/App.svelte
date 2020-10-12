<script lang="ts">
  import {
    QueryClientProvider,
  } from "../../src";
  import Queries from "./Queries.svelte"
</script>

<main>
  <QueryClientProvider>
    <Queries />
  </QueryClientProvider>
</main>
  