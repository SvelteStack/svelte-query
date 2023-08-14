---
id: ssr
title: SSR & SvelteKit
---

Svelte Query supports two ways of prefetching data on the server and passing that to the queryClient.

- Prefetch the data yourself and pass it in as `initialData`
  - Quick to set up for simple cases
  - Has some caveats
- Prefetch the query on the server, dehydrate the cache and rehydrate it on the client
  - Requires slightly more setup up front

## Using SvelteKit

### Using `initialData`

Together with SvelteKit's [`load`](https://kit.svelte.dev/docs#loading), you can pass the data you fetch to `useQuery`'s' `initialData` option:

```markdown
<script context="module">
  export async function load() {
    const posts = await getPosts()
    return { props: { posts } }
  }
</script>

<script>
  export let posts;
  const queryResult = useQuery('posts', getPosts, { initialData: posts });
</script>
```

The setup is minimal and this can be a quick solution for some cases, but there are a **few tradeoffs to consider** when compared to the full approach:

- If you are calling `useQuery` in a component deeper down in the tree you need to pass the `initialData` down to that point
- If you are calling `useQuery` with the same query in multiple locations, you need to pass `initialData` to all of them
- There is no way to know at what time the query was fetched on the server, so `dataUpdatedAt` and determining if the query needs refetching is based on when the page loaded instead

### Using Hydration

Svelte Query supports prefetching multiple queries on the server in SvelteKit and then _dehydrating_ those queries to the queryClient. This means the server can prerender markup that is immediately available on page load and as soon as JS is available, Svelte Query can upgrade or _hydrate_ those queries with the full functionality of the library. This includes refetching those queries on the client if they have become stale since the time they were rendered on the server.

To support caching queries on the server and set up hydration:

- Create a new `QueryClient` instance
- Wrap your app component with `<QueryClientProvider>` and pass it the client instance
- Wrap your app component with `<Hydrate>` and pass it the `dehydratedState` prop from `pageProps`

```markdown
// __layout.svelte
<script lang="ts">
	import { QueryClient, QueryClientProvider, Hydrate } from '@sveltestack/svelte-query';
	import { page } from '$app/stores';
  const {dehydrateState} = $page.stuff;

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<Hydrate state={dehydratedState}>
		<slot />
	</Hydrate>
</QueryClientProvider>
```

Now you are ready to prefetch some data in your pages with [`load`](https://kit.svelte.dev/docs#loading).

- Create a new `QueryClient` instance
- Prefetch the data using the clients `prefetchQuery` method and wait for it to complete
- Use `dehydrate` to dehydrate the query cache and pass it to the page via the `dehydratedState` prop. This is the same prop that the cache will be picked up from in your `__layout.svelte`

```markdown
// pages/posts.svelte
<script context="module">
  import { dehydrate, QueryClient, useQuery } from 'react-query';

export async function load() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery('posts', getPosts)

  return {
    stuff: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
</script>
<script>
  const queryResult = useQuery('posts', getPosts)

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix
  const otherQueryResult = useQuery('posts-2', getPosts)

</script>
```

As demonstrated, it's fine to prefetch some queries and let others fetch on the queryClient. This means you can control what content server renders or not by adding or removing `prefetchQuery` for a specific query.