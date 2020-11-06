---
id: overview
title: Overview
---

Svelte Query is often described as the missing data-fetching library for Svelte, but in more technical terms, it makes **fetching, caching, synchronizing and updating server state** in your Svelte applications a breeze.

## Motivation

Out of the box, Svelte applications **do not** come with an opinionated way of fetching or updating data from your components so developers end up building their own ways of fetching data. This usually means cobbling together component-based state and effect using Svelte hooks, or using more general purpose state management libraries to store and provide asynchronous data throughout their apps.

While most traditional state management libraries are great for working with client state, they are **not so great at working with async or server state**. This is because **server state is totally different**. For starters, server state:

- Is persisted remotely in a location you do not control or own
- Requires asynchronous APIs for fetching and updating
- Implies shared ownership and can be changed by other people without your knowledge
- Can potentially become "out of date" in your applications if you're not careful

Once you grasp the nature of server state in your application, **even more challenges will arise** as you go, for example:

- Caching... (possibly the hardest thing to do in programming)
- Deduping multiple requests for the same data into a single request
- Updating out of date data in the background
- Knowing when data is "out of date"
- Reflecting updates to data as quickly as possible
- Performance optimizations like pagination and lazy loading data
- Managing memory and garbage collection of server state
- Memoizing query results with structural sharing

If you're not overwhelmed by that list, then that must mean that you've probably solved all of your server state problems already and deserve an award. However, if you are like a vast majority of people, you either have yet to tackle all or most of these challenges and we're only scratching the surface!

Svelte Query is hands down one of the _best_ libraries for managing server state. It works amazingly well **out-of-the-box, with zero-config, and can be customized** to your liking as your application grows.

Svelte Query allows you to defeat and overcome the tricky challenges and hurdles of _server state_ and control your app data before it starts to control you.

On a more technical note, Svelte Query will likely:

- Help you remove **many** lines of complicated and misunderstood code from your application and replace with just a handful of lines of Svelte Query logic.
- Make your application more maintainable and easier to build new features without worrying about wiring up new server state data sources
- Have a direct impact on your end-users by making your application feel faster and more responsive than ever before.
- Potentially help you save on bandwidth and increase memory performance

## Enough talk, show me some code already!

In the example below, you can see Svelte Query in its most basic and simple form being used to fetch the GitHub stats for the Svelte Query GitHub project itself:

[Open in CodeSandbox](https://codesandbox.io/s/github/TanStack/svelte-query/tree/main/examples/simple)

```markdown
<script>
  // App.svelte
  import { QueryClient, QueryClientProvider } from 'svelte-query'

  const queryClient = new QueryClient()
</script>

<QueryClientProvider client={queryClient}>
  <Example />
</QueryClientProvider>

```

```markdown
<script>
  // Example.svelte
  import { useQuery } from 'svelte-query'

  const queryResult = useQuery('repoData', () =>
    fetch('https://api.github.com/repos/TanStack/svelte-query').then(res =>
      res.json()
    )
  )
</script>

{#if $queryResult.isLoading}
  <span>Loading...</span>
{:else if $queryResult.error}
  <span>An error has occurred: {$queryResult.error.message}</span>
{:else}
  <div>
    <h1>{$queryResult.data.name}</h1>
    <p>{$queryResult.data.description}</p>
    <strong>👀 {$queryResult.data.subscribers_count}</strong>{' '}
    <strong>✨ {$queryResult.data.stargazers_count}</strong>{' '}
    <strong>🍴 {$queryResult.data.forks_count}</strong>
  </div>
{/if}

```

## You talked me into it, so what now?

- Learn Svelte Query at your own pace with our amazingly thorough [Walkthough Guide](../installation) and [API Reference](../reference/useQuery)
