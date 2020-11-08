<script>
  import axios from 'axios'
  import { useInfiniteQuery } from '@reactstack/svelte-query'

  const endPoint = 'https://s8dfj.sse.codesandbox.io/api'

  const fetchProjects = async ({ pageParam = 0 }) => {
    const { data } = await axios.get(`${endPoint}/projects?cursor=${pageParam}`)
    return data
  }

  const queryOptions = {
    queryKey: 'projects',
    queryFn: fetchProjects,
    getNextPageParam: lastGroup => lastGroup.nextId || undefined,
  }

  const queryResult = useInfiniteQuery(queryOptions)
</script>

<h1>Infinite Loading</h1>
{#if $queryResult.status === 'loading'}
  Loading...
{:else if $queryResult.status === 'error'}
  <span>Error: {$queryResult.error.message}</span>
{:else}
  <div>
    {#each $queryResult.data.pages as page}
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
      disabled={!$queryResult.hasNextPage || $queryResult.isFetchingNextPage}>
      {#if $queryResult.isFetching}
        Loading more...
      {:else if $queryResult.hasNextPage}
        Load More
      {:else}Nothing more to load{/if}
    </button>
  </div>
{/if}
