<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import BasicQuery from '../components/BasicQuery.svelte'
</script>

<QueryClientProvider>
  <BasicQuery />
</QueryClientProvider>
