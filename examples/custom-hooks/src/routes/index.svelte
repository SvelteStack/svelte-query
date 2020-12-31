<script>
  import { QueryClientProvider } from '@sveltestack/svelte-query'

  import BasicQuery from '../components/BasicQuery.svelte'
</script>

<QueryClientProvider>
  <BasicQuery />
</QueryClientProvider>
