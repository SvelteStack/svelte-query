<script lang="ts">
  import axios, { AxiosError } from 'axios'
  import { useQuery } from '../../../../src'

  export let postId
  export let setPostId

  const getPostById = async id => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    )
    return data
  }
  const post = useQuery<{ title: string; body: string }, AxiosError>(
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
