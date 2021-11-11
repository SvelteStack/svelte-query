<script lang="ts">
  import type { QueryFilters } from '../queryCore/core/utils'

  import useIsFetching from './useIsFetching'

  export let filters: QueryFilters | undefined = undefined
  export let isFetching: number | undefined = undefined

  $: isFetchingResult = useIsFetching(filters)
  $: isFetching = $isFetchingResult
</script>

<slot name="isFetching" {isFetching} />
