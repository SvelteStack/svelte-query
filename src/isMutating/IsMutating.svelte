<script lang="ts">
  import type { MutationFilters } from '../queryCore/core/utils'

  import useIsMutating from './useIsMutating'

  export let filters: MutationFilters | undefined = undefined
  export let isMutating: number | undefined = undefined

  $: isMutatingResult = useIsMutating(filters)
  $: isMutating = $isMutatingResult
</script>

<slot name="isMutating" {isMutating} />
