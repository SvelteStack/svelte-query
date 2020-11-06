---
id: disabling-queries
title: Disabling/Pausing Queries
---

If you ever want to disable a query from automatically running, you can use the `enabled = false` option.

When `enabled` is `false`:

- If the query has cached data
  - The query will be initialized in the `status === 'success'` or `isSuccess` state.
- If the query does not have cached data
  - The query will start in the `status === 'idle'` or `isIdle` state.
- The query will not automatically fetch on mount.
- The query will not automatically refetch in the background when new instances mount or new instances appearing
- The query will ignore query client `invalidateQueries` and `refetchQueries` calls that would normally result in the query refetching.
- `refetch` can be used to manually trigger the query to fetch.

```markdown
<script>
  const queryResult = useQuery('todos', fetchTodoList, {
    enabled: false,
  })
</script>

{#if $queryResult.isIdle}
  <span>Not ready....</span>
{#if $queryResult.isLoading}
  <span>Loading...</span>
{:else if $queryResult.isError}
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