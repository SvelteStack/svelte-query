<script>
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import BasicQuery from './BasicQuery.svelte'
</script>

<QueryClientProvider>
  <BasicQuery />
</QueryClientProvider>
