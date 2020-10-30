---
id: parallel-queries
title: Parallel Queries
---

"Parallel" queries are queries that are executed in parallel, or at the same time so as to maximize fetching concurrency.

## Manual Parallel Queries

When the number of parallel queries does not change, there is **no extra effort** to use parallel queries. Just use any number of Svelte Query's `useQuery` and `useInfiniteQuery` hooks side-by-side!

```js
  // The following queries will execute in parallel
  const usersQuery = useQuery('users', fetchUsers)
  const teamsQuery = useQuery('teams', fetchTeams)
  const projectsQuery = useQuery('projects', fetchProjects)
  ...
```

## Dynamic Parallel Queries with `useQueries`

If the number of queries you need to execute is changing from render to render, you cannot use manual querying since that would violate the rules of hooks. Instead, Svelte Query provides a `useQueries` hook, which you can use to dynamically execute as many queries in parallel as you'd like.

`useQueries` accepts an **array of query options objects** and returns an **array of query results**:

```js
let users = [...]

const userQueries = useQueries(
  users.map(user => {
    return {
      queryKey: ['user', user.id],
      queryFn: () => fetchUserById(user.id),
    }
  })
)

// or use <Queries {queries}>...</Queries> component
```
