<script lang="ts">
  import axios from 'axios'
  import { useMutation, useQuery, useQueryClient } from '../../../../src'

  const endPoint = 'https://fc16z.sse.codesandbox.io/api/data'

  const client = useQueryClient()

  let text

  // Query
  const fetchTodos = async () => {
    const { data } = await axios.get(endPoint)
    return data
  }

  const queryResult = useQuery("todos", fetchTodos);

  // Mutation
  const addTodo = text => axios.post(endPoint, { text })

  const mutationResult = useMutation("mutation", addTodo, {
    onMutate: todo => {
      text = ''
      client.cancelQueries('todos')

      const previousValue = client.getQueryData('todos')

      client.setQueryData('todos', (old: any) => ({
        ...old,
        items: [...old.items, todo],
      }))

      return previousValue
    },
    // On failure, roll back to the previous value
    onError: (err, variables, { data }) =>
      client.setQueryData('todos', data),
    // After success or failure, refetch the todos query
    onSettled: () => {
      client.invalidateQueries('todos')
    },
  });
</script>

<p>
  In this example, new items can be created using a mutation. The new item will
  be optimistically added to the list in hopes that the server accepts the item.
  If it does, the list is refetched with the true items from the list. Every now
  and then, the mutation may fail though. When that happens, the previous list
  of items is restored and the list is again refetched from the server.
</p>


<div>
  <form
    on:submit={e => {
      e.preventDefault()
      e.stopPropagation()
      $mutationResult.mutate(text)
    }}>
    <input type="text" bind:value={text} />
    <button>Create</button>
  </form>
</div>

<div>
  {#if $queryResult.status === 'loading'}
    Loading...
  {:else if $queryResult.status === 'error'}
    <span>Error: {$queryResult.error.message}</span>
  {:else}
    <br />
    <div>
      Updated At:
      {new Date($queryResult.data.ts).toLocaleTimeString()}
    </div>
    <ul>
      {#each $queryResult.data.items as datum}
        <li>{datum}</li>
      {/each}
    </ul>
    <div>{$queryResult.isFetching ? 'Updating in background...' : ' '}</div>
  {/if}
</div>
