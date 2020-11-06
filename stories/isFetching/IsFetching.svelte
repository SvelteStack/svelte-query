<script lang="ts">
  import { Query, IsFetching } from '../../src'
  import type { UseQueryResult } from '../../src'
  import { useIsFetching } from '../../src/isFetching'

  const later = (delay, value) =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the query fn
  const queryFn = () => later(500, 'My Data')
  // the query fn 2
  const queryFn2 = () => later(500, 'My Data 2')

  // The query result
  let queryResultApp: UseQueryResult<string>
  // The query result2
  let queryResultApp2: UseQueryResult<string>

  let isFetching = 0
  let history = []
  $: {
    history = [...history, isFetching]
  }

  // useIsFetching
  const isFetchingResult = useIsFetching()
  let useHistory = []
  $: {
    useHistory = [...useHistory, $isFetchingResult]
  }
</script>

<main>
  <h3>IsFetching</h3>
  <IsFetching bind:isFetching>
    <div slot="isFetching">
      isFetching change log:
      <span>{JSON.stringify(history)}</span>
    </div>
  </IsFetching>

  <h3>useIsFetching</h3>
  <div>
    useIsFetching change log:
    {JSON.stringify(useHistory)}
    <div>
      <button
        on:click={() => {
          queryResultApp2.refetch()
          queryResultApp.refetch()
        }}>
        refetch All
      </button>

      <h3>Query</h3>
      <Query
        bind:queryResult={queryResultApp}
        options={{ queryKey: 'myQuery', queryFn }}>
        <div slot="query" let:queryResult>
          {#if queryResult.isLoading || queryResult.isFetching}
            <p>Query loading...</p>
          {:else}
            <p>{queryResult.data}</p>
          {/if}
          <button on:click={() => queryResult.refetch()}>refetch Query</button>
        </div>
      </Query>

      <h3>Query 2</h3>
      <Query
        bind:queryResult={queryResultApp2}
        options={{ queryKey: 'myQuery2', queryFn: queryFn2 }}>
        <div slot="query" let:queryResult>
          {#if queryResult.isLoading || queryResult.isFetching}
            <p>Query 2 loading...</p>
          {:else}
            <p>{queryResult.data}</p>
          {/if}
          <button on:click={() => queryResult.refetch()}>refetch Query 2</button>
        </div>
      </Query>
    </div>
  </div>
</main>
