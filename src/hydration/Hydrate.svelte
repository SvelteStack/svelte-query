<script lang="ts">
  import type { DehydratedState, HydrateOptions } from '../queryCore/hydration'
  import useHydrate from './useHydrate'

  export let state: DehydratedState
  export let options: HydrateOptions

  useHydrate(state, options)
</script>

<slot />
