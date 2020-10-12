<script lang="ts">
  import {
    QueryClientProvider,
  } from "../../src";
  import Query from "./Query.svelte"
</script>
  
<main>
    <QueryClientProvider>
        <Query />
    </QueryClientProvider>
</main>
  