<script lang="ts">
  import { useIsFetching, useQuery } from '../../../src'

  const later = (delay: number, value: unknown) =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the query fn
  const queryFn = () => later(500, 'My Data')
  // the query fn 2
  const queryFn2 = () => later(500, 'My Data 2')

  const queryResult = useQuery('myQuery', queryFn)
  const queryResult2 = useQuery('myQuery2', queryFn2)

  // useIsFetching
  const isFetching = useIsFetching()

  let useHistory: number[] = []
  $: {
    useHistory = [...useHistory, $isFetching]
  }
</script>

<main>
  <h3>useIsFetching</h3>
  <div>
    useIsFetching change log:
    <span>{JSON.stringify(useHistory)}</span>
    <div>
      <button
        on:click={() => {
          $queryResult.refetch();
          $queryResult2.refetch();
        }}
      >
        refetch All
      </button>

      <h3>Query</h3>
      <div>
        {#if $queryResult.isLoading || $queryResult.isFetching}
          <p>Query loading...</p>
        {:else}
          <p>{$queryResult.data}</p>
        {/if}
        <button on:click={() => $queryResult.refetch()}>refetch Query</button>
      </div>

      <h3>Query 2</h3>
      <div>
        {#if $queryResult2.isLoading || $queryResult2.isFetching}
          <p>Query 2 loading...</p>
        {:else}
          <p>{$queryResult2.data}</p>
        {/if}
        <button on:click={() => $queryResult2.refetch()}>refetch Query 2</button
        >
      </div>
    </div>
  </div>
</main>
