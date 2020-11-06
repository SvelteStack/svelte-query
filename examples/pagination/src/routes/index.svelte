<script>
  import { QueryClientProvider } from 'svelte-query'
  import Pagination from '../components/Pagination.svelte'
</script>

<QueryClientProvider>
  <Pagination />
</QueryClientProvider>
