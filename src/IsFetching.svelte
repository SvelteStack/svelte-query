<script lang="ts">
  import { onDestroy } from "svelte";

  import type { QueryFilters } from "./query/core/utils";
  import type { QueryClient } from "./query/core";
  import { useQueryClient } from "./QueryClientProvider.svelte";

  export let filters: QueryFilters;

  const client: QueryClient = useQueryClient();

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
