<script lang="ts">
  import axios from 'axios'
import { writable } from 'svelte/store';
  import { useQuery, useQueryClient } from '../../../../src'

  const endPoint = 'https://931rd.sse.codesandbox.io/api'

  // if the api (like in this example) just have a simple numeric pagination
  let page = writable(0)

  const fetchProjects = async () => {
    
    const { data } = await axios.get(`${endPoint}/projects?page=${$page}`)
    return data
  }

  const queryResult = useQuery(['projects', $page], fetchProjects, {
    keepPreviousData: true
  })

  $: {
    $queryResult.refetch()
  }
</script>

<p>
  In this example, each page of data remains visible as the next page is
  fetched. The buttons and capability to proceed to the next page are also
  supressed until the next page cursor is known. Each page is cached as a normal
  query too, so when going to previous pages, you'll see them instantaneously
  while they are also refetched invisibly in the background.
</p>

<div>
  {#if $queryResult.status === 'loading'}
    Loading...
  {:else if $queryResult.status === 'error'}
    <span>Error: {$queryResult.error.message}</span>
  {:else}
    <div>
      {#each $queryResult.data.projects as project}
        <p>{project.name}</p>
      {/each}
    </div>
    <span>Current Page: {$page + 1}</span>
    <button
      on:click={() => {
        page.set(Math.max($page - 1, 0))
      }}
      disabled={$page === 0}
    >
      Previous Page
    </button>
    <button
      on:click={() => {
        // Here, we use `latestData` so the Next Page
        // button isn't relying on potentially old data
        page.set(
          $queryResult.data && !$queryResult.data.hasMore ? $page : $page + 1
        )
      }}
      disabled={$queryResult.data && !$queryResult.data.hasMore}
    >
      Next Page
    </button>
  {/if}
</div>
