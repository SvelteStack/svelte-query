<script>
  import { QueryClientProvider } from 'svelte-query'
  import BasicQuery from '../components/BasicQuery.svelte'
</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<QueryClientProvider>
  <BasicQuery />
</QueryClientProvider>
