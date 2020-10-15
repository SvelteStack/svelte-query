<script lang="ts">
  import axios, { AxiosError } from 'axios'
  import { useQuery, useQueryClient } from '../../../src'

  export let setPostId

  const client = useQueryClient()
  const posts = useQuery<
    { id: string; title: string; body: string }[],
    AxiosError
  >('posts', async () => {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )
    return data
  })
</script>

<div>
  <h1>Posts</h1>
  <div>
    {#if $posts.status === 'loading'}
      Loading...
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
