<script lang="ts">
  import { useQueryClient } from '@reactstack/svelte-query'

  import usePosts from './usePosts'

  export let setPostId

  const client = useQueryClient()
  const posts = usePosts()
</script>

<div>
  <h1>Posts</h1>
  <div>
    {#if $posts.status === 'loading'}
      <span><span>Loading...</span></span>
    {:else if $posts.status === 'error'}
      <span>Error: {$posts.error.message}</span>
    {:else}
      <div>
        {#each $posts.data as post}
          <p>
            <span
              on:click={() => setPostId(post.id)}
              style={// We can use the queryCache here to show bold links for
              // ones that are cached
              client.getQueryData([
                'post',
                post.id,
              ]) ? 'color: green; font-weight: bold; cursor: pointer;' : 'cursor: pointer;'}>
              {post.title}
            </span>
          </p>
        {/each}
      </div>
      <div>{$posts.isFetching ? 'Background Updating...' : ' '}</div>
    {/if}
  </div>
</div>
