<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import Pagination from './Pagination.svelte'
</script>

<QueryClientProvider>
  <Pagination />
</QueryClientProvider>
