<script lang="ts">
  import { useQuery } from '../../../src'

  const later = (delay: number, value: unknown): Promise<string> =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the query fn
  const queryFn = () => later(1000, 'My Data')
  // the query fn 2
  const queryFn2 = () => later(500, 'My Data 2')

  const queryResult = useQuery<string>('dep-myQuery', { queryFn })
  const queryResult2 = useQuery<string>('dep-myQuery2', {
    queryFn: queryFn2,
    enabled: !!$queryResult.data,
  })

  $: queryResult2.updateOptions({
    enabled: !!$queryResult.data,
  })
</script>

<main>
  <h3>Query with useQuery</h3>
  {#if $queryResult.isLoading === true}
    <p>Query loading...</p>
  {:else}
    <p>{$queryResult.data}</p>
  {/if}

  <h3>Query 2 depend on Query</h3>
  <div>
    {#if $queryResult2.isIdle === true}
      <p>Query 2 idle...</p>
    {:else if $queryResult2.isLoading === true}
      <p>Query 2 loading...</p>
    {:else}
      <p>{$queryResult2.data}</p>
    {/if}
  </div>
</main>
