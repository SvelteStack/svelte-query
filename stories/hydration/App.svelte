<script lang="ts">
  import { QueryClientProvider, Hydrate } from '../../src'
  import { hashQueryKey } from '../../src/queryCore'
  import Hydration from './Hydration.svelte'

  const state = {
    queries: [
      {
        queryKey: 'myQuery',
        data: 'My cached data',
        queryHash: hashQueryKey('myQuery'),
        config: {},
      },
    ],
  }
</script>

<QueryClientProvider>
  <Hydrate {state}>
    <Hydration />
  </Hydrate>
</QueryClientProvider>
