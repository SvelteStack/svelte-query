---
id: paginated-queries
title: Paginated / Lagged Queries
---

Rendering paginated data is a very common UI pattern and in Svelte Query, it "just works" by including the page information in the query key:

```js
<Query options={{queryKey: ['projects', page], queryFn: fetchProjects}} />
```

However, if you run this simple example, you might notice something strange:

**The UI jumps in and out of the `success` and `loading` states because each new page is treated like a brand new query.**

This experience is not optimal and unfortunately is how many tools today insist on working. But not Svelte Query! As you may have guessed, Svelte Query comes with an awesome featured called `keepPreviousData` that allows us to get around this.

## Better Paginated Queries with `keepPreviousData`

Consider the following example where we would ideally want to increment a pageIndex (or cursor) for a query. If we were to use `useQuery`, **it would still technically work fine**, but the UI would jump in and out of the `success` and `loading` states as different queries are created and destroyed for each page or cursor. By setting `keepPreviousData` to `true` we get a few new things:

- **The data from the last successful fetch available while new data is being requested, even though the query key has changed**.
- When the new data arrives, the previous `data` is seamlessly swapped to show the new data.
- `isPreviousData` is made available to know what data the query is currently providing you

```markdown
<script>
  let page = 0

  const fetchProjects = (page = 0) => fetch('/api/projects?page=' + page)
</script>

<Query options={{ queryKey: ['projects', page], queryFn: () => fetchProjects(page) }}>
  <div slot="query" let:queryResult>
    {#if queryResult.status === 'loading'}
      Loading...
    {:else if queryResult.status === 'error'}
      <span>Error: {queryResult.error.message}</span>
    {:else}
      <div>
        {#each queryResult.data.pages as page}
          {#each page.data as project}
            <p>{project.name}</p>
          {/each}
        {/each}
      </div>
    {/if}
    <span>Current Page: {page + 1}</span>
    <button
      on:click={() => {
        page = Math.max(old - 1, 0)
      }}
      disabled={page === 0}>
      Previous Page
    </button>
    <button
      on:click={() => {
        if (!queryResult.isPreviousData && queryResult.data.hasMore) {
          page = page + 1
        }
      }}
      //Disable the Next Page button until we know a next page is available
      disabled={queryResult.isPreviousData || !queryResult.data.hasMore}>
      Next Page
    </button>
  </div>
</Query>

```

## Lagging Infinite Query results with `keepPreviousData`

While not as common, the `keepPreviousData` option also works flawlessly with the `useInfiniteQuery` hook, so you can seamlessly allow your users to continue to see cached data while infinite query keys change over time.
