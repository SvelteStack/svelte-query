<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'
  import axios from 'axios'

  import BasicQuery from '../components/BasicQuery.svelte'

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
