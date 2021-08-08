<script lang="ts">
  import { useQueries } from '../../../src'

  const later = (delay: number, value: unknown): Promise<string> =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the query fn
  const queryFn = () => later(500, 'My Data')
  // the query fn 2
  const queryFn2 = () => later(500, 'My Data 2')

  const queries = [
    { queryKey: 'myQuery', queryFn },
    { queryKey: 'myQuery2', queryFn: queryFn2 },
  ]

  const queriesStore = useQueries(queries)
</script>

<main>
  <h3>Queries with useQueries</h3>

  <button on:click={() => $queriesStore[0].refetch()}>refetch Query</button>

  <button on:click={() => $queriesStore[1].refetch()}>refetch Query 2</button>

  <button
    on:click={() => {
      $queriesStore[0].refetch();
      $queriesStore[1].refetch();
    }}
  >
    refetch All
  </button>

  {#if $queriesStore[0].isLoading || $queriesStore[0].isFetching}
    <p>Query loading...</p>
  {:else}
    <p>{$queriesStore[0].data}</p>
  {/if}

  {#if $queriesStore[1].isLoading || $queriesStore[1].isFetching}
    <p>Query 2 loading...</p>
  {:else}
    <p>{$queriesStore[1].data}</p>
  {/if}
</main>
