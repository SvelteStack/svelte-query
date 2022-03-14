---
id: queries
title: Queries
---

## Query Basics

A query is a declarative dependency on an asynchronous source of data that is tied to a **unique key**. A query can be used with any Promise based method (including GET and POST methods) to fetch data from a server. If your method modifies data on the server, we recommend using [Mutations](https://sveltequery.vercel.app/guides/mutations) instead.

To subscribe to a query in your components or custom hooks, call the `useQuery` hook with at least:

- A **unique key for the query**
- A function that returns a promise that:
  - Resolves the data, or
  - Throws an error

```js
import { useQuery } from '@sveltestack/svelte-query'

const info = useQuery('todos', fetchTodoList)
```

The **unique key** you provide is used internally for refetching, caching, and sharing your queries throughout your application.

The query results returned by `useQuery` contains all of the information about the query that you'll need for templating and any other usage of the data:

```js
const result = useQuery('todos', fetchTodoList)
```

The `result` object contains a few very important states you'll need to be aware of to be productive. A query can only be in one of the following states at any given moment:

- `isLoading` or `status === 'loading'` - The query has no data and is currently fetching
- `isError` or `status === 'error'` - The query encountered an error
- `isSuccess` or `status === 'success'` - The query was successful and data is available
- `isIdle` or `status === 'idle'` - The query is currently disabled (you'll learn more about this in a bit)

Beyond those primary states, more information is available depending on the state the query:

- `error` - If the query is in an `isError` state, the error is available via the `error` property.
- `data` - If the query is in a `success` state, the data is available via the `data` property.
- `isFetching` - In any state, if the query is fetching at any time (including background refetching) `isFetching` will be `true`.

For **most** queries, it's usually sufficient to check for the `isLoading` state, then the `isError` state, then finally, assume that the data is available and render the successful state:

```markdown

<script>
  import { useQuery } from '@sveltestack/svelte-query';

  const queryResult = useQuery('todos', fetchTodos)
</script>

{#if $queryResult.isLoading}
  <span>Loading...</span>
{:else if $queryResult.isError}
  <span>Error: {$queryResult.error.message}</span>
{:else}
  <ul>
    {#each $queryResult.data as todo}
      <li>{todo.title}</li>
    {/each}
  </ul>
{/if}

```

If booleans aren't your thing, you can always use the `status` state as well:

```markdown
<script>
  import { useQuery } from '@sveltestack/svelte-query';

  const queryResult = useQuery('todos', fetchTodos)
</script>

{#if $queryResult.status === 'loading'}
  <span>Loading...</span>
{:else if $queryResult.status === 'error'}
  <span>Error: {$queryResult.error.message}</span>
{:else}
  <ul>
    {#each $queryResult.data as todo}
      <li>{todo.title}</li>
    {/each}
  </ul>
{/if}
```

## What if I want to enable/disable queries reactively?

Sometimes you may want to enable or disable a Query by using a svelte [reactive statement](https://svelte.dev/tutorial/reactive-statements). In this case, you can use the `setEnabled` function:

```markdown
<script>
  import { useQuery } from '@sveltestack/svelte-query';

  export let isEnabled = false;

  const queryResult = useQuery('todos', fetchTodos)
  $: queryResult.setEnabled(isEnabled)
</script>

{#if $queryResult.isIdle}
  <button on:click={() => isEnabled = true}>Enable</button>
{:else if $queryResult.isLoading}
  <span>Loading...</span>
{:else if $queryResult.isError}
  <span>Error: {$queryResult.error.message}</span>
{:else}
  <ul>
    {#each $queryResult.data as todo}
      <li>{todo.title}</li>
    {/each}
  </ul>
{/if}
```
