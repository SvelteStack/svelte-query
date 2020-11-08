<script>
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import BasicQuery from '../../basic/src/BasicQuery.svelte'

  const defaultQueryFn = async key => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com${key}`
    )
    return data
  }

  const defaultOptions = {
    queries: {
      queryFn: defaultQueryFn,
    },
  }
</script>

<QueryClientProvider {defaultOptions}>
  <BasicQuery />
</QueryClientProvider>
