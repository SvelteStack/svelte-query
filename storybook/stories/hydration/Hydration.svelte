<script lang="ts">
  import { useQuery } from '../../../src/query'

  const later: (delay: any, value: any) => Promise<string> = (delay, value) =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the query fn
  const queryFn: () => Promise<string> = () => later(500, 'My Data')
  const queryResult = useQuery<string>('myQuery', queryFn, { enabled: false })
</script>

<main>
  <h3>Query with hydration</h3>
  {#if $queryResult.isLoading || $queryResult.isFetching}
    <p>Query loading...</p>
  {:else}
    <p>{$queryResult.data}</p>
  {/if}
  <button on:click={() => $queryResult.refetch()}>refetch Query</button>
</main>
