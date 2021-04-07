<script lang="ts">
  import { QueryClientProvider } from '../../../src'
  import IsFetching from './IsFetching.svelte'
</script>

<QueryClientProvider>
  <IsFetching />
</QueryClientProvider>
