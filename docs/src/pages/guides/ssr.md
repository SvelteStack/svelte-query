---
id: ssr
title: SSR
---

Svelte Query supports two ways of prefetching data on the server and passing that to the queryClient.

- Prefetch the data yourself and pass it in as `initialData`
  - Quick to set up for simple cases
  - Has some caveats
- Prefetch the query on the server, dehydrate the cache and rehydrate it on the client
  - Requires slightly more setup up front

## Using Sapper

Coming soon !