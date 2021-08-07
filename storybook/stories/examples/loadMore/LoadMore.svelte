<script lang="ts">
  import axios, { AxiosError } from 'axios'
  import { useInfiniteQuery } from '../../../../src'

  const endPoint = 'https://s8dfj.sse.codesandbox.io/api'

  type Data = {
    data: { name: string }[]
    nextId: number | null
  }

  const fetchProjects = async ({ pageParam = 0 }): Promise<Data> => {
    const { data } = await axios.get(`${endPoint}/projects?cursor=${pageParam}`)
    return data
  }

  const queryResult = useInfiniteQuery<Data, AxiosError>(
    'projects',
    fetchProjects,
    {
      getNextPageParam: lastGroup => lastGroup.nextId || undefined,
    }
  )
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
          style="border: 1px solid gray; border-radius: 5px; padding: 10rem 1rem"
        >
          {project.name}
        </p>
      {/each}
    {/each}
  </div>
  <div>
    <button
      on:click={() => $queryResult.fetchNextPage()}
      disabled={!$queryResult.hasNextPage || $queryResult.isFetchingNextPage}
    >
      {#if $queryResult.isFetching}
        Loading more...
      {:else if $queryResult.hasNextPage}
        Load More
      {:else}Nothing more to load{/if}
    </button>
  </div>
{/if}
