<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import BasicQuery from './BasicQuery.svelte'
</script>

<QueryClientProvider>
  <BasicQuery />
</QueryClientProvider>
