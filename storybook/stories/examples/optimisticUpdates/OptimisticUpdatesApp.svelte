<script lang="ts">
  import { QueryClientProvider } from '../../../../src'
  import OptimisticUpdates from './OptimisticUpdates.svelte'
</script>

<QueryClientProvider>
  <OptimisticUpdates />
</QueryClientProvider>
