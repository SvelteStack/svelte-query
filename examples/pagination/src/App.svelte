<script>
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import Pagination from './Pagination.svelte'
</script>

<QueryClientProvider>
  <Pagination />
</QueryClientProvider>
