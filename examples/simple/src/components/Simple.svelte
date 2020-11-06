<script>
  import { useQuery } from 'svelte-query'

  const queryResult = useQuery('repoData', () => {
    if (process.browser)
      return fetch(
        'https://api.github.com/repos/TanStack/svelte-query'
      ).then(res => res.json())
  })
</script>

{#if $queryResult.isLoading}
  Loading...
{:else if $queryResult.error}
  An error has occurred:
  {$queryResult.error.message}
{:else}
  <div>
    <h1>{$queryResult.data.name}</h1>
    <p>{$queryResult.data.description}</p>
    <strong>👀 {$queryResult.data.subscribers_count}</strong>{' '}
    <strong>✨ {$queryResult.data.stargazers_count}</strong>{' '}
    <strong>🍴 {$queryResult.data.forks_count}</strong>
  </div>
{/if}
