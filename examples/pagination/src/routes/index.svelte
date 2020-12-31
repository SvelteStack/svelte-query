<script>
  import { QueryClientProvider } from '@sveltestack/svelte-query'

  import Pagination from '../components/Pagination.svelte'
</script>

<QueryClientProvider>
  <Pagination />
</QueryClientProvider>
