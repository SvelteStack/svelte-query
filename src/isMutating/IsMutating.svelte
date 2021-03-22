<script lang="ts">
  import type { MutationFilters } from '../queryCore/core/utils'

  import useIsMutating from './useIsMutating'

  export let filters: MutationFilters
  export let isMutating

  $: isMutatingResult = useIsMutating(filters)
  $: isMutating = $isMutatingResult
</script>

<slot name="isMutating" {isMutating} />
