<script lang="ts">
  import { request, gql } from 'graphql-request'
  import { useQuery, useQueryClient } from '../../../../src'

  export let setPostId: any

  const client = useQueryClient()
  const endpoint = 'https://graphqlzero.almansi.me/api'

  const posts = useQuery<
    { id: string; title: string; body: string }[],
    { message: string }
  >('ql-posts', async () => {
    const {
      posts: { data },
    } = await request(
      endpoint,
      gql`
        query {
          posts {
            data {
              id
              title
            }
          }
        }
      `
    )
    return data
  })
</script>

<div>
  <h1>Posts</h1>
  <div>
    State: {$posts.status}
  </div>
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
              client.getQueryData(['ql-post', post.id])
                ? 'color: green; font-weight: bold; cursor: pointer;'
                : 'cursor: pointer;'}
            >
              {post.title}
            </span>
          </p>
        {/each}
      </div>
      <div>{$posts.isFetching ? 'Background Updating...' : ' '}</div>
    {/if}
  </div>
</div>
