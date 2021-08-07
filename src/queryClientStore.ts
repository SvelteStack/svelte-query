import { QueryClient } from 'react-query/core'
import { writable, get } from 'svelte/store'

let client = new QueryClient()

client.mount()

const clientStore = writable(client, () => {
  return client.unmount()
})

export const resetClientStore = (queryclient?: QueryClient) => {
  console.log('STORE RESET')
  const client = queryclient || new QueryClient()

  client.getQueryCache().clear()
  client.getMutationCache().clear()

  clientStore.set(client)

  client.mount()

  return client
}

export const queryClient = clientStore

export default clientStore
