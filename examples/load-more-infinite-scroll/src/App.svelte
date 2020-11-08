<script>
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import LoadMore from './LoadMore.svelte'
</script>

<QueryClientProvider>
  <LoadMore />
</QueryClientProvider>
