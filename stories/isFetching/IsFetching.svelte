<script lang="ts">
  import {
    QueryClientProvider,
    Query,
    IsFetching,
  } from "../../src";
  import type { QueryResult } from "../../src";

  const later = (delay, value) =>
    new Promise((resolve) => setTimeout(resolve, delay, value));

  // the query fn
  const queryFn = () => later(500, "My Data");
  // the query fn 
  const queryFn2 = () => later(500, "My Data 2");
  
  // The query result    
  let queryResultApp: QueryResult<string>;
  // The query result2
  let queryResultApp2: QueryResult<string>;

  let isFetching = 0;
  let history = [];
  $: {
    history = [...history, isFetching];
  }
</script>

<main>
  <QueryClientProvider>
    <h3>IsFetching</h3>
    <IsFetching bind:isFetching />
    isFetching change log:
    <span>{JSON.stringify(history)}<span>

    <h3>Query</h3>
    <Query
      bind:queryResult={queryResultApp}
      options={{ queryKey: 'myQuery', queryFn }} />
    {#if queryResultApp && (queryResultApp.isLoading || queryResultApp.isFetching)}
      <p>Query loading...</p>
    {:else}
      <p>{queryResultApp && queryResultApp.data}</p>
    {/if}

    <h3>Query 2</h3>
    <Query
      bind:queryResult={queryResultApp2}
      options={{ queryKey: 'myQuery2', queryFn: queryFn2 }} />
    {#if queryResultApp2 && (queryResultApp2.isLoading || queryResultApp2.isFetching)}
      <p>Query 2 loading...</p>
    {:else}
      <p>{queryResultApp2 && queryResultApp2.data}</p>
    {/if}

    <button on:click={() => queryResultApp.refetch()}>refetch Query</button>

    <button on:click={() => queryResultApp2.refetch()}>refetch Query 2</button>

    <button on:click={() => {
      queryResultApp2.refetch();
      queryResultApp.refetch()}}>
      refetch All
    </button>

  </QueryClientProvider>
</main>
