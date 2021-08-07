<script lang="ts">
  import { useQuery } from '../../../src'

  const later = (delay, value): Promise<string> =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the query fn
  const queryFn = () => later(1000, 'My Data')
  // the query fn 2
  const queryFn2 = () => later(500, 'My Data 2')

  const queryResult = useQuery<string>('myQuery', { queryFn })
  const queryResult2 = useQuery<string>('myQuery2', { queryFn: queryFn2, enabled: !!$queryResult.data })
</script>

<main>
  <h3>Query with useQuery</h3>
  {#if $queryResult.isFetched !== true}
    <p>Query loading...</p>
  {:else}
    <p>{$queryResult.data}</p>
  {/if}

  <h3>Query 2 depend on Query</h3>
    <div>
      {#if $queryResult2.isFetched !== true}
        <p>Query 2 loading...</p>
      {:else}
        <p>{$queryResult2.data}</p>
      {/if}
      <button on:click={() => $queryResult2.refetch()}>refetch Query</button>
    </div>
</main>
