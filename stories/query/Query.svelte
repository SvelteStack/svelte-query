<script lang="ts">
  import {
    QueryClientProvider,
    Query
  } from "../../src";
  import type { QueryResult } from "../../src";

  const later = (delay, value) =>
    new Promise((resolve) => setTimeout(resolve, delay, value));

  // the query fn
  const queryFn = () => later(1000, "My Data");
  // the query fn 2
  const queryFn2 = () => later(500, "My Data 2");
  
  // The query result
  let queryResultApp: QueryResult<string>;
  // The query result2
  let queryResultApp2: QueryResult<string>;
</script>

<main>
  <QueryClientProvider>
    <h3>Query</h3>
    <Query
      bind:queryResult={queryResultApp}
      options={{ queryKey: 'myQuery', queryFn }} />
    {#if queryResultApp && (queryResultApp.isLoading || queryResultApp.isFetching)}
      <p>Query loading...</p>
    {:else}
      <p>{queryResultApp && queryResultApp.data}</p>
    {/if}

    <h3>Query 2 depend on Query</h3>
    <Query
      bind:queryResult={queryResultApp2}
      options={{ queryKey: 'myQuery2', queryFn: queryFn2, enabled: !!(queryResultApp && queryResultApp.data)}} />
    {#if queryResultApp2 && (queryResultApp2.isLoading || queryResultApp2.isFetching)}
      <p>Query 2 loading...</p>
    {:else}
      <p>{queryResultApp2 && queryResultApp2.data}</p>
    {/if}
  </QueryClientProvider>
</main>
