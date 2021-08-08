import { QueryClient } from 'react-query/core'
import { writable, get } from 'svelte/store'

let client = new QueryClient()

client.mount()

const clientStore = writable(client, () => {
  return client.unmount()
})

export const resetClientStore = (queryclient?: QueryClient) => {
  const client = queryclient || new QueryClient()

  clientStore.set(client)

  client.mount()

  client.clear()

  return client
}

export const queryClient = clientStore

export default clientStore
