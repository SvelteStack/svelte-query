<script>
  import { QueryClientProvider } from 'svelte-query'
  import OptimisticUpdates from '../components/OptimisticUpdates.svelte'
</script>

<QueryClientProvider>
  <OptimisticUpdates />
</QueryClientProvider>
