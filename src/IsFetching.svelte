<script context="module" lang="ts">
  import { readable } from 'svelte/store';

  import { parseFilterArgs } from "./query/core/utils";
  import type { QueryFilters } from "./query/core/utils";
  import type { QueryClient, QueryKey } from "./query/core";
  import { useQueryClient } from "./QueryClientProvider.svelte";

  export function useIsFetching(filters?: QueryFilters)
  export function useIsFetching(
    queryKey?: QueryKey,
    filters?: QueryFilters
  )
  export function useIsFetching(
    arg1?: QueryKey | QueryFilters,
    arg2?: QueryFilters
  ) {
    const [filters] = parseFilterArgs(arg1, arg2)
    const client: QueryClient = useQueryClient();
    const cache = client.getCache();
    let isFetching = client.isFetching(filters)

    let { subscribe } = readable(isFetching, (set) => {
        return cache.subscribe(()=>{
          const newIsFetching = client.isFetching(filters);
          if (isFetching !== newIsFetching) {
            isFetching = newIsFetching;
            set(isFetching)
          }
        });
    });

    return { subscribe };
  }
</script>

<script lang="ts">
  export let filters: QueryFilters;
  export let isFetching;

  $: isFetchingResult = useIsFetching(filters)
  $: isFetching = $isFetchingResult

</script>

<slot name="isFetching" {isFetching} />
