<script>
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import OptimisticUpdates from './OptimisticUpdates.svelte'
</script>

<QueryClientProvider>
  <OptimisticUpdates />
</QueryClientProvider>
