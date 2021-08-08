import type { QueryClient } from 'react-query/core'
import { queryClient } from './queryClientStore'

export function useQueryClient(): QueryClient {
  let client: null | QueryClient = null;

  const unsubscribe = queryClient.subscribe(newClient => {
    if (client !== null) {
      console.log("got new Query client");
    }

    client = newClient;
  })

  return client as unknown as QueryClient;
}
