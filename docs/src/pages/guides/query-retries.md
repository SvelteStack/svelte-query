---
id: query-retries
title: Query Retries
---

When a `useQuery` query fails (the query function throws an error), Svelte Query will automatically retry the query if that query's request has not reached the max number of consecutive retries (defaults to `3`) or a function is provided to determine if a retry is allowed.

You can configure retries both on a global level and an individual query level.

- Setting `retry = false` will disable retries.
- Setting `retry = 6` will retry failing requests 6 times before showing the final error thrown by the function.
- Setting `retry = true` will infinitely retry failing requests.
- Setting `retry = (failureCount, error) => ...` allows for custom logic based on why the request failed.

```js
import { useQuery } from '@tanstack/svelte-query'

// Make a specific query retry a certain number of times
const queryResult = useQuery(['todos', 1], fetchTodoListPage, {
  retry: 10, // Will retry failed requests 10 times before displaying an error
})
```

## Retry Delay

By default, retries in Svelte Query do not happen immediately after a request fails. As is standard, a back-off delay is gradually applied to each retry attempt.

The default `retryDelay` is set to double (starting at `1000`ms) with each attempt, but not exceed 30 seconds:

```markdown
<script>
// Configure for all queries
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
</script>

<QueryClientProvider client={queryClient}>...</QueryClientProvider>
```

Though it is not recommended, you can obviously override the `retryDelay` function/integer in both the Provider and individual query options. If set to an integer instead of a function the delay will always be the same amount of time:

```js
const queryResult = useQuery('todos', fetchTodoList, {
  retryDelay: 1000, // Will always wait 1000ms to retry, regardless of how many retries
})
```
