<script lang="ts">
  import { useHydrate } from '../../../src'
  import { hashQueryKey } from '../../../src'
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
    mutations: []
  }

  useHydrate(state);
</script>

<Hydration />
