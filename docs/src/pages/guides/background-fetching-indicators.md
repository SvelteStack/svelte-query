---
id: background-fetching-indicators
title: Background Fetching Indicators
---

A query's `status === 'loading'` state is sufficient enough to show the initial hard-loading state for a query, but sometimes you may want to display an additional indicator that a query is refetching in the background. To do this, queries also supply you with an `isFetching` boolean that you can use to show that it's in a fetching state, regardless of the state of the `status` variable:

```markdown
<script>
  import { useQuery } from 'svelte-query';

  const queryResult = useQuery('todos', fetchTodos)
</script>

{#if $queryResult.status === 'loading'}
  <span>Loading...</span>
{:else if $queryResult.status === 'error'}
  <span>Error: {$queryResult.error.message}</span>
{:else}
  {#if $queryResult.isFetching}
    <div>Refreshing...</div>
  {/if}
  {#each $queryResult.data as todo}
    <Todo {todo} />
  {/each}
{/if}
```

# Displaying Global Background Fetching Loading State

In addition to individual query loading states, if you would like to show a global loading indicator when **any** queries are fetching (including in the background), you can use the `useIsFetching` hook:

```markdown
<script>
  import { useIsFetching } from 'svelte-query'

  const isFetching = useIsFetching()
</script>

{#if $isFetchingResult}
  <div>Queries are fetching in the background...</div>
{/if}
```
