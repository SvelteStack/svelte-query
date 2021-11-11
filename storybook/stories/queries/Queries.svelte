<script lang="ts">
  import { Queries } from '../../../src'
  import { useQueries } from '../../../src/queries'

  type Later = <T>(delay: number, value: T) => Promise<T>

  const later: Later = (delay, value) =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the query fn
  const queryFn = () => later(500, 'My Data')
  // the query fn 2
  const queryFn2 = () => later(500, 'My Data 2')
  // the query fn 3
  const queryFn3 = () => later(500, true)

  const queries = [
    { queryKey: 'myQuery', queryFn },
    { queryKey: 'myQuery2', queryFn: queryFn2 },
    { queryKey: 'myQuery3', queryFn: queryFn3 },
  ] as const

  const queriesStore = useQueries(queries)
</script>

<main>
  <h3>Queries</h3>
  <Queries {queries}>
    <div slot="queries" let:currentResult>
      {#if currentResult[0].isLoading || currentResult[0].isFetching}
        <p>Query loading...</p>
      {:else}
        <p>{currentResult[0].data}</p>
      {/if}

      {#if currentResult[1].isLoading || currentResult[1].isFetching}
        <p>Query 2 loading...</p>
      {:else}
        <p>{currentResult && currentResult[1].data}</p>
      {/if}

      <button on:click={() => currentResult[0].refetch()}>refetch Query</button>

      <button on:click={() => currentResult[1].refetch()}>refetch Query 2</button>

      <button
        on:click={() => {
          currentResult[0].refetch()
          currentResult[1].refetch()
        }}>
        refetch All
      </button>
    </div>
  </Queries>

  <h3>Queries with useQueries</h3>
  {#if $queriesStore[0].isLoading || $queriesStore[0].isFetching}
    <p>useQuery loading...</p>
  {:else}
    <p>{$queriesStore[0].data}</p>
  {/if}

  {#if $queriesStore[1].isLoading || $queriesStore[1].isFetching}
    <p>useQuery 2 loading...</p>
  {:else}
    <p>{$queriesStore[1].data}</p>
  {/if}
</main>
