<script lang="ts">
  import { QueryClientProvider } from '../../../src'
  import IsFetching from './IsMutating.svelte'
</script>

<QueryClientProvider>
  <IsFetching />
</QueryClientProvider>
