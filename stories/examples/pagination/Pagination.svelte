<script lang="ts">
  import axios from 'axios'
  import { Query, useQueryClient } from '../../../src'

  const endPoint = 'https://931rd.sse.codesandbox.io/api'

  const client = useQueryClient()

  let page = 0
  const setPage = (newPage: number) => {
    page = newPage
  }

  const fetchProjects = async (key, page = 0) => {
    const { data } = await axios.get(`${endPoint}/projects?page=${page}`)
    return data
  }

  const prefetchNextPage = data => {
    if (data && data.hasMore) {
      client.prefetchQuery(['projects', page + 1], fetchProjects)
    }
  }

  $: queryOptions = {
    queryKey: ['projects', page],
    queryFn: fetchProjects,
    onSuccess: prefetchNextPage,
  }
</script>

<p>
  In this example, each page of data remains visible as the next page is
  fetched. The buttons and capability to proceed to the next page are also
  supressed until the next page cursor is known. Each page is cached as a normal
  query too, so when going to previous pages, you'll see them instantaneously
  while they are also refetched invisibly in the background.
</p>
<Query options={queryOptions}>
  <div slot="query" let:queryResult>
    {#if queryResult.status === 'loading'}
      Loading...
    {:else if queryResult.status === 'error'}
      <span>Error: {queryResult.error.message}</span>
    {:else}
      <div>
        {#each queryResult.data.projects as project}
          <p>{project.name}</p>
        {/each}
      </div>
      <span>Current Page: {page + 1}</span>
      <button
        on:click={() => setPage(Math.max(page - 1, 0))}
        disabled={page === 0}>
        Previous Page
      </button>
      <button
        on:click={() => // Here, we use `latestData` so the Next Page
          // button isn't relying on potentially old data
          setPage(queryResult.data && !queryResult.data.hasMore ? page : page + 1)}
        disabled={queryResult.data && !queryResult.data.hasMore}>
        Next Page
      </button>
      {#if queryResult.isFetching}Loading...{/if}
    {/if}
  </div>
</Query>
