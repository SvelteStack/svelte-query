---
id: quick-start
title: Quick Start
---

This example very briefly illustrates the 3 core concepts of Svelte Query:

- Queries
- Mutations
- Query Invalidation

```markdown
<script>
  //App.svelte
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'
  import Todos from 'Todos.svelte'

  // Create a client
  const queryClient = new QueryClient()

</script>

<QueryClientProvider client={queryClient}>
  <Todos />
</QueryClientProvider>

```

```markdown
<script>
  // Todos.svelte
  import { useQuery, useMutation, useQueryClient } from '@sveltestack/svelte-query'
  import { getTodos, postTodo } from '../my-api'
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const queryResult = useQuery('todos', getTodos)

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('todos')
    },
  })
</script>

<div>
  <ul>
    {#each $queryResult.data as todo}
      <li>{todo.title}</li>
    {/each}
  </ul>

  <button
    on:click={() => {
      $mutation.mutate({ id: Date.now(), title: 'Do Laundry' })
    }}>
    Add Todo
  </button>
</div>
```

These three concepts make up most of the core functionality of Svelte Query. The next sections of the documentation will go over each of these core concepts in great detail.
