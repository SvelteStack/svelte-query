<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import LoadMore from './LoadMore.svelte'
</script>

<QueryClientProvider>
  <LoadMore />
</QueryClientProvider>
