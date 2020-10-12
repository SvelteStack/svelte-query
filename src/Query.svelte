<script context="module" lang="ts">
  import { readable } from 'svelte/store';
  
  import type { QueryClient } from "./query/core";
  import { useQueryClient } from "./QueryClientProvider.svelte";
  import type { QueryOptions } from "./types";

  export function useQuery<TData = unknown, TError = unknown>(
      options: QueryOptions<TData, TError>
  ) {
    const client: QueryClient = useQueryClient();
    let defaultedOptions = client.defaultQueryObserverOptions(options);
    const observer = client.watchQuery<TData, TError>(defaultedOptions);

    let { subscribe } = readable(observer.getCurrentResult(), (set) => {
        return observer.subscribe(set);
    });

    function setOptions(options: QueryOptions<TData, TError>) {
        const defaultedOptions = client.defaultQueryObserverOptions(options);
        observer.setOptions(defaultedOptions);
    }

    return { subscribe, setOptions };
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  export let options: QueryOptions;
  export let queryResult

  let firstRender = true

  onMount(() => {
    firstRender = false;
  });

  const query = useQuery(options)
  $: queryResult = $query

  $: {
    if (!firstRender) {
      query.setOptions(options);
    }
  }
</script>

<slot name="query" {queryResult} />
