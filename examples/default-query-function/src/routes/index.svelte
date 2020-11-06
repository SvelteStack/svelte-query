<script>
  import { QueryClientProvider, QueryClient } from 'svelte-query'
  import axios from 'axios'

  import BasicQuery from '../components/BasicQuery.svelte'

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
