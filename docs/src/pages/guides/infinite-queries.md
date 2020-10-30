---
id: infinite-queries
title: Infinite Queries
---

Rendering lists that can additively "load more" data onto an existing set of data or "infinite scroll" is also a very common UI pattern. Svelte Query supports a useful version of `useQuery` called `useInfiniteQuery` for querying these types of lists.

When using `useInfiniteQuery`, you'll notice a few things are different:

- `data` is now an object containing infinite query data:
- `data.pages` array containing the fetched pages
- `data.pageParams` array containing the page params used to fetch the pages
- The `fetchNextPage` and `fetchPreviousPage` functions are now available
- The `getNextPageParam` and `getPreviousPageParam` options are available for both determining if there is more data to load and the information to fetch it. This information is supplied as an additional parameter in the query function (which can optionally be overridden when calling the `fetchNextPage` or `fetchPreviousPage` functions)
- A `hasNextPage` boolean is now available and is `true` if `getNextPageParam` returns a value other than `undefined`.
- A `hasPreviousPage` boolean is now available and is `true` if `getPreviousPageParam` returns a value other than `undefined`.
- The `isFetchingNextPage` and `isFetchingPreviousPage` booleans are now available to distinguish between a background refresh state and a loading more state

## Example

Let's assume we have an API that returns pages of `projects` 3 at a time based on a `cursor` index along with a cursor that can be used to fetch the next group of projects:

```js
fetch('/api/projects?cursor=0')
// { data: [...], nextCursor: 3}
fetch('/api/projects?cursor=3')
// { data: [...], nextCursor: 6}
fetch('/api/projects?cursor=6')
// { data: [...], nextCursor: 9}
fetch('/api/projects?cursor=9')
// { data: [...] }
```

With this information, we can create a "Load More" UI by:

- Waiting for `useInfiniteQuery` to request the first group of data by default
- Returning the information for the next query in `getNextPageParam`
- Calling `fetchNextPage` function

> Note: It's very important you do not call `fetchNextPage` with arguments unless you want them to override the `pageParam` data returned from the `getNextPageParam` function. eg. Do not do this: `<button onClick={fetchNextPage} />` as this would send the onClick event to the `fetchNextPage` function.

```markdown
<script>
  import { useInfiniteQuery } from 'svelte-query'

  const fetchProjects = async (key, nextId = 0) => {
    const { data } = await axios.get(`/projects?cursor=${nextId}`)
    return data
  }

  const queryResult = useInfiniteQuery('projects', fetchProjects, {
    getNextPageParam: lastGroup => lastGroup.nextId || undefined,
  })
</script>

{#if $queryResult.status === 'loading'}
  Loading...
{:else if $queryResult.status === 'error'}
  <span>Error: {$queryResult.error.message}</span>
{:else}
  <div>
    {#each $queryResult.data.pages as page}
      {#each page.data as project}
        <p>{project.name}</p>
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

```

## What happens when an infinite query needs to be refetched?

When an infinite query becomes `stale` and needs to be refetched, each group is fetched `sequentially`, starting from the first one. This ensures that even if the underlying data is mutated we're not using stale cursors and potentially getting duplicates or skipping records. If an infinite query's results are ever removed from the queryCache, the pagination restarts at the initial state with only the initial group being requested.

## What if I need to pass custom information to my query function?

By default, the variable returned from `getNextPageParam` will be supplied to the query function, but in some cases, you may want to override this. You can pass custom variables to the `fetchNextPage` function which will override the default variable like so:

```markdown
<script>
  import { useInfiniteQuery } from 'svelte-query'

  const fetchProjects = async (key, nextId = 0) => {
    const { data } = await axios.get(`/projects?cursor=${nextId}`)
    return data
  }

  const queryResult = useInfiniteQuery('projects', fetchProjects, {
    getNextPageParam: lastGroup => lastGroup.nextId || undefined,
  })

  // Pass your own page param
  const skipToCursor50 = () => $queryResult.fetchNextPage({ pageParam: 50 })
</script>

```

## What if I want to implement a bi-directional infinite list?

Bi-directional lists can be implemented by using the `getPreviousPageParam`, `fetchPreviousPage`, `hasPreviousPage` and `isFetchingPreviousPage` properties and functions.

```js
useInfiniteQuery('projects', fetchProjects, {
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
})
```

## What if I want to show the pages in reversed order?

Sometimes you may want to show the pages in reversed order. If this is case, you can use the `select` option:

```js
useInfiniteQuery('projects', fetchProjects, {
  select: data => ({
    pages: [...data.pages].reverse(),
    pageParams: [...data.pageParams].reverse(),
  }),
})
```

## What if I want to manually update the infinite query?

Manually removing first page:

```js
queryClient.setQueryData('projects', data => ({
  pages: data.pages.slice(1),
  pageParams: data.pageParams.slice(1),
}))
```
