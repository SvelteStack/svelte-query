<script lang="ts">
  import type { QueryFilters } from '../queryCore/core/utils'

  import useIsFetching from './useIsFetching'

  export let filters: QueryFilters
  export let isFetching

  $: isFetchingResult = useIsFetching(filters)
  $: isFetching = $isFetchingResult
</script>

<slot name="isFetching" {isFetching} />
