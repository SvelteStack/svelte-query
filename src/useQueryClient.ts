import type { QueryClient } from 'react-query/core'
import { queryClient } from './queryClientStore'
import { onDestroy, onMount, beforeUpdate, afterUpdate } from "svelte/internal"

export function useQueryClient(): QueryClient {
  // console.log("Subscribe to queryClient");
  let client: null | QueryClient = null;

  const unsubscribe = queryClient.subscribe(newClient => {
    if (client !== null) {
      console.log("got new Query client");
    }

    client = newClient;
  })

  // onMount(() => {
  //   console.log("onMount");
  // })

  // beforeUpdate(() => {
  //   console.log("beforeUpdate");
  // })

  // afterUpdate(() => {
  //   console.log("afterUpdate");
  // })

  onDestroy(() => {
    // console.log("onDestroy", "unsubscribe from client");
    unsubscribe()
  })

  return client as unknown as QueryClient;
}
