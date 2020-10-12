<script context="module" lang="ts">
  import { readable } from 'svelte/store';
  
  import type { QueryClient } from "./query/core";
  import type { QueryOptions } from "./types";
  import { useQueryClient } from "./QueryClientProvider.svelte";
  
  export function useQueries<TData, TError>(
    queries: QueryOptions[]
    ) {
      const client: QueryClient = useQueryClient();
      const observer = client.watchQueries(queries);
      
      let { subscribe } = readable(observer.getCurrentResult(), (set) => {
        return observer.subscribe(set);
      });
      
      const setQueries = (queries:  QueryOptions[])=>{
        observer.setQueries(queries)
      }
      
      return { subscribe, setQueries };
    }
  </script>

<script lang="ts">
  import { onMount } from "svelte";
  
  export let queries: QueryOptions[];
  export let currentResult

  let firstRender = true

  onMount(() => {
    firstRender = false;
  });

  const queriesStore = useQueries(queries)
  $: currentResult = $queriesStore

  $: {
    if (!firstRender) {
      queriesStore.setQueries(queries);
    }
  }
</script>

<slot name="queries" {currentResult} />
