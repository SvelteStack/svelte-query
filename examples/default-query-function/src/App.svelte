<script>
  import axios from 'axios'
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import BasicQuery from './BasicQuery.svelte'

  const defaultQueryFn = async ({ queryKey }) => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com${queryKey[0]}`
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
