<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import LoadMore from '../components/LoadMore.svelte'
</script>

<QueryClientProvider>
  <LoadMore />
</QueryClientProvider>
