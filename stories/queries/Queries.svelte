<script lang="ts">
  import {
    QueryClientProvider,
    Queries
  } from "../../src";
  import type { QueryResult } from "../../src";

  const later = (delay, value) =>
    new Promise((resolve) => setTimeout(resolve, delay, value));

  // the query fn
  const queryFn = () => later(500, "My Data");
  // the query fn 2
  const queryFn2 = () => later(500, "My Data 2");
  
  // The queries result
  let queriesResultApp: QueryResult<string>[];

</script>

<main>
  <QueryClientProvider>
    <h3>Queries</h3>
    <Queries
      bind:currentResult={queriesResultApp}
      queries={[
        { queryKey: 'myQuery', queryFn },
        { queryKey: 'myQuery2', queryFn: queryFn2 }
        ]} />
    {#if queriesResultApp && (queriesResultApp[0].isLoading || queriesResultApp[0].isFetching)}
      <p>Query loading...</p>
    {:else}
      <p>{queriesResultApp && queriesResultApp[0].data}</p>
    {/if}

    {#if queriesResultApp && (queriesResultApp[1].isLoading || queriesResultApp[1].isFetching)}
      <p>Query 2 loading...</p>
    {:else}
      <p>{queriesResultApp && queriesResultApp[1].data}</p>
    {/if}

    <button on:click={() => queriesResultApp[0].refetch()}>refetch Query</button>

    <button on:click={() => queriesResultApp[1].refetch()}>refetch Query 2</button>

    <button on:click={() => {
      queriesResultApp[0].refetch();
      queriesResultApp[1].refetch()}}>
      refetch All
    </button>
  </QueryClientProvider>
</main>
