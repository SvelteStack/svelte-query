<script lang="ts">
  import { useHydrate } from '../../../src'
  import { hashQueryKey } from '../../../src'
  import Hydration from './Hydration.svelte'

  const state = {
    queries: [
      {
        queryKey: 'hydration-myQuery',
        state: {
          data: 'My cached data',
        },
        queryHash: hashQueryKey('hydration-myQuery'),
        config: {},
        cacheTime: 2000,
      },
    ],
    mutations: [],
  }

  useHydrate(state as any)
</script>

<Hydration />
