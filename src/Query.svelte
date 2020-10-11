<script lang="ts">
  import { getContext, onMount, onDestroy } from "svelte";

  import type { QueryClient } from "./query/core";
  import type { QueryOptions, QueryResult } from "./types";

  export let options: QueryOptions;

  let firstRender = true;
  let unsubscribe;
  const client: QueryClient = getContext("queryClient");
  let defaultedOptions = client.defaultQueryObserverOptions(options);
  const observer = client.watchQuery(defaultedOptions);

  onMount(() => {
    firstRender = false;
    unsubscribe = observer.subscribe((result) => {
      queryResult = result;
    });
  });

  $: {
    if (!firstRender) {
      defaultedOptions = client.defaultQueryObserverOptions(options);
      observer.setOptions(defaultedOptions);
    }
  }

  export let queryResult: QueryResult = observer.getCurrentResult();

  onDestroy(() => {
    unsubscribe();
  });
</script>

<slot name="query" {queryResult} />
