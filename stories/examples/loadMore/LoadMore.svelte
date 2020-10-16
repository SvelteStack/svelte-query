<script lang="ts">
  import axios, { AxiosError } from 'axios'
  import { QueryOptions, useQuery } from '../../../src'

  const endPoint = 'https://s8dfj.sse.codesandbox.io/api'

  type Data = {
    data: { name: string }[]
    nextId: number | null
  }[]

  const fetchProjects = async (key, nextId = 0): Promise<Data> => {
    const { data } = await axios.get(`${endPoint}/projects?cursor=${nextId}`)
    return data
  }

  const queryOptions: QueryOptions<Data> = {
    queryKey: 'projects',
    queryFn: fetchProjects,
    // for inifine query => the query result is an arry of results
    infinite: true,
    //@ts-ignore
    getNextPageParam: lastGroup => lastGroup.nextId,
  }

  const queryResult = useQuery<Data, AxiosError>(queryOptions)
  let hasNextPage = true

  $: {
    const pages = $queryResult.data
    // bug with queryResult.hasNextPage (need to open an ussues)
    hasNextPage = pages ? !!pages[pages.length - 1].nextId : true
  }
</script>

<h1>Infinite Loading</h1>
{#if $queryResult.status === 'loading'}
  Loading...
{:else if $queryResult.status === 'error'}
  <span>Error: {$queryResult.error.message}</span>
{:else}
  <div>
    {#each $queryResult.data as page}
      {#each page.data as project}
        <p
          style="border: 1px solid gray; border-radius: 5px; padding: 10rem 1rem">
          {project.name}
        </p>
      {/each}
    {/each}
  </div>
  <div>
    <button
      on:click={() => $queryResult.fetchNextPage()}
      disabled={!hasNextPage || $queryResult.isFetchingNextPage}>
      {#if $queryResult.isFetching}
        Loading more...
      {:else if hasNextPage}Load More{:else}Nothing more to load{/if}
    </button>
  </div>
{/if}
