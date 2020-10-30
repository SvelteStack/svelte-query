---
id: dependent-queries
title: Dependent Queries
---

Dependent (or serial) queries depend on previous ones to finish before they can execute. To achive this, it's as easy as using the `enabled` option to tell a query when it is ready to run:

```markdown
<script>
  // Get the user
  const queryUserResult = useQuery(['user', email], getUserByEmail)
  let userId
  $: userId = $queryUserResult.data?.id
  
  // Then get the user's projects
  const queryProjectsResult = useQuery(
    ['projects', userId],
    getProjectsByUser,
    {
      // The query will not execute until the userId exists
      enabled: !!userId,
    }
  )
  
  $: {
      queryProjectsResult.setOptions(
      ['projects', userId],
      getProjectsByUser,
      {
        enabled: !!userId,
      })
    }
  // $queryProjectsResult.isIdle will be `true` until `enabled` is true and the query begins to fetch.
  // It will then go to the `isLoading` stage and hopefully the `isSuccess` stage :)
</script>
```

The same example using the `Query`component to avoid calling the setOptions.

```markdown
<script>
  // Get the user
  const queryUserResult = useQuery(['user', email], getUserByEmail)
  let userId
  $: userId = $queryUserResult.data?.id
</script>

<Query options={{ queryKey: ['projects', userId], queryFn: getProjectsByUser, enabled: !!userId }}>
  <div slot="query" let:queryProjectsResult>
    // queryProjectsResult.isIdle will be `true` until `enabled` is true and the query begins to fetch.
    // It will then go to the `isLoading` stage and hopefully the `isSuccess` stage :)
  </div>
</Query>
```