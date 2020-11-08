<script>
  import { QueryClientProvider } from '@tanstack/svelte-query'
  import BasicQuery from '../components/BasicQuery.svelte'
</script>

<QueryClientProvider>
  <BasicQuery />
</QueryClientProvider>
