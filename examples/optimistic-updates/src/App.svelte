<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import OptimisticUpdates from './OptimisticUpdates.svelte'
</script>

<QueryClientProvider>
  <OptimisticUpdates />
</QueryClientProvider>
