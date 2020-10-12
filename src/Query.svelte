<script context="module" lang="ts">
  import { readable } from 'svelte/store';
  
  import type { QueryClient, QueryFunction, QueryKey } from "./query/core";
  import { parseQueryArgs } from './query/core/utils';
  import { useQueryClient } from "./QueryClientProvider.svelte";
  import type { QueryOptions } from "./types";

  export function useQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
  >(
    options: QueryOptions<TData, TError, TQueryFnData>
  )
  export function useQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
  >(
    queryKey: QueryKey,
    options?: QueryOptions<TData, TError, TQueryFnData>
  )
  export function useQuery<
    TData = unknown,
    TError = unknown,
    TQueryFnData = TData
  >(
    queryKey: QueryKey,
    queryFn: QueryFunction<TQueryFnData | TData>,
    options?: QueryOptions<TData, TError, TQueryFnData>
  )
  export function useQuery<TData, TError, TQueryFnData = TData>(
    arg1: QueryKey | QueryOptions<TData, TError, TQueryFnData>,
    arg2?:
      | QueryFunction<TData | TQueryFnData>
      | QueryOptions<TData, TError, TQueryFnData>,
    arg3?: QueryOptions<TData, TError, TQueryFnData>
  ){
    const options = parseQueryArgs(arg1, arg2, arg3)
    const client: QueryClient = useQueryClient();
    let defaultedOptions = client.defaultQueryObserverOptions(options);
    const observer = client.watchQuery<TData, TError, TQueryFnData>(defaultedOptions);

    let { subscribe } = readable(observer.getCurrentResult(), (set) => {
        return observer.subscribe(set);
    });

    function setOptions(options: QueryOptions<TData, TError, TQueryFnData>) {
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
