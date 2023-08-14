---
id: hydration/HydrateComp
title: hydration/Hydrate
---

`hydration/Hydrate` adds a previously dehydrated state into the `queryClient` that would returned by running `useQueryCache`. If the client already contains data, the new queries will be intelligently merged based on update timestamp.

```markdown
<script>
import { Hydrate } from '@sveltestack/svelte-query'
</script>

<Hydrate state={dehydratedState}>...</Hydrate>

```

**Options**

- `state: DehydratedState`
  - The state to hydrate
- `options: HydrateOptions`
  - Optional
  - `defaultOptions: QueryOptions`
    - The default query options to use for the hydrated queries.
