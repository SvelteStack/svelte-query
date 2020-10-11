<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import type { QueryClient } from "./query/core";
  import { useQueryClient } from "./QueryClientProvider.svelte";
  import type { QueryOptions, QueryResult } from "./types";

  export let queries: QueryOptions[];

  let firstRender = true;
  let unsubscribe;
  const client: QueryClient = useQueryClient();
  const observer = client.watchQueries(queries);

  onMount(() => {
    firstRender = false;
    unsubscribe = observer.subscribe((result) => {
      currentResult = result;
    });
  });

  $: {
    if (!firstRender) {
      queries = queries;
      observer.setQueries(queries);
    }
  }

  export let currentResult: QueryResult[] = observer.getCurrentResult();

  onDestroy(() => {
    unsubscribe();
  });
</script>

<slot name="queries" {currentResult} />
