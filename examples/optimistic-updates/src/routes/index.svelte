<script>
  import { QueryClientProvider } from '@sveltestack/svelte-query'

  import OptimisticUpdates from '../components/OptimisticUpdates.svelte'
</script>

<QueryClientProvider>
  <OptimisticUpdates />
</QueryClientProvider>
