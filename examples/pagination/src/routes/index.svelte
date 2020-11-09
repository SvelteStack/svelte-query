<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import Pagination from '../components/Pagination.svelte'
</script>

<QueryClientProvider>
  <Pagination />
</QueryClientProvider>
