<script lang="ts">
  import { QueryClientProvider, Hydrate } from '../../src'
  import { hashQueryKey } from '../../src/queryCore'
  import Hydration from './Hydration.svelte'

  const state = {
    queries: [
      {
        queryKey: 'myQuery',
        state: {
          data: 'My cached data',
        },
        queryHash: hashQueryKey('myQuery'),
        config: {},
        cacheTime: 2000,
      },
    ],
  }
</script>

<QueryClientProvider>
  <Hydrate {state}>
    <Hydration />
  </Hydrate>
</QueryClientProvider>
