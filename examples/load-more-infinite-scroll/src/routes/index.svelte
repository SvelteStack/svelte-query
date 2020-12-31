<script>
  import { QueryClientProvider } from '@sveltestack/svelte-query'

  import LoadMore from '../components/LoadMore.svelte'
</script>

<QueryClientProvider>
  <LoadMore />
</QueryClientProvider>
