<script lang="ts">
  import { getContext, onDestroy } from "svelte";

  import type { QueryFilters } from "./query/core/utils";
  import type { QueryClient } from "./query/core";

  export let filters: QueryFilters;

  const client: QueryClient = getContext("queryClient");

  export let isFetching = client.isFetching(filters);

  let unsubscribe = client.getCache().subscribe(() => {
    const newIsFetching = client.isFetching(filters);
    if (isFetching !== newIsFetching) {
      isFetching = newIsFetching;
    }
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<slot name="isFetching" {isFetching} />
