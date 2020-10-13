<script lang="ts">
  import type { HydrateOptions } from '../queryCore/hydration'
  import useHydrate from './useHydrate'

  export let state: unknown
  export let options: HydrateOptions

  useHydrate(state, options)
</script>

<slot />
