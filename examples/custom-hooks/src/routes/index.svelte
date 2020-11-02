<script>
  import { QueryClientProvider } from 'svelte-query'
  import BasicQuery from '../components/BasicQuery.svelte'
</script>

<QueryClientProvider>
  <BasicQuery />
</QueryClientProvider>
