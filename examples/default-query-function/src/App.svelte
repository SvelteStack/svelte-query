<script>
  import axios from 'axios'
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import BasicQuery from './BasicQuery.svelte'

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
