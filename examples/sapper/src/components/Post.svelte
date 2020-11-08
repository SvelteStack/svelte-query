<script lang="ts">
  import { request, gql } from 'graphql-request'
  import { useQuery } from '@tanstack/svelte-query'

  export let postId
  export let setPostId

  const endpoint = 'https://graphqlzero.almansi.me/api'

  const getPostById = async id => {
    const { post } = await request(
      endpoint,
      gql`
        query {
          post(id: ${id}) {
            id
            title
            body
          }
        }
        `
    )
    return post
  }

  const post = useQuery<{ title: string; body: string }, { message: string }>(
    ['post', postId],
    () => getPostById(postId),
    {
      enabled: !!postId,
    }
  )
</script>

<div>
  <div>
    <span style="cursor: pointer;" on:click={() => setPostId(-1)}> Back </span>
  </div>
  {#if !postId || $post.status === 'loading'}
    Loading...
  {:else if $post.status === 'error'}
    <span>Error: {$post.error.message}</span>
  {:else}
    <h1>{$post.data.title}</h1>
    <div>
      <p>{$post.data.body}</p>
    </div>
    <div>{$post.isFetching ? 'Background Updating...' : ' '}</div>
  {/if}
</div>
