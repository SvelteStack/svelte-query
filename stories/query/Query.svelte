<script lang="ts">
  import { Query } from '../../src'
  import { useQuery } from '../../src/query'

  const later = (delay, value): Promise<string> =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the query fn
  const queryFn = () => later(1000, 'My Data')
  // the query fn 2
  const queryFn2 = () => later(500, 'My Data 2')

  const queryResult = useQuery<string>('myQuery', { queryFn })
</script>

<main>
  <h3>Query with useQuery</h3>
  {#if $queryResult.isLoading || $queryResult.isFetching}
    <p>Query loading...</p>
  {:else}
    <p>{$queryResult.data}</p>
  {/if}

  <h3>Query 2 depend on Query</h3>
  <Query
    options={{ queryKey: 'myQuery2', queryFn: queryFn2, enabled: !!$queryResult.data }}>
    <div slot="query" let:queryResult>
      {#if queryResult.isLoading || queryResult.isFetching}
        <p>Query 2 loading...</p>
      {:else}
        <p>{queryResult.data}</p>
      {/if}
      <button on:click={() => queryResult.refetch()}>refetch Query</button>
    </div>
  </Query>
</main>
