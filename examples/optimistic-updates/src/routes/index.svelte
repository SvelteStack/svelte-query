<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import OptimisticUpdates from '../components/OptimisticUpdates.svelte'
</script>

<QueryClientProvider>
  <OptimisticUpdates />
</QueryClientProvider>
