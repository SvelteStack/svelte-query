import { getContext } from 'svelte'

import { QueryClient } from '../queryCore/core/queryClient'

export default function useQueryClient(): QueryClient {
  return getContext('queryClient')
}