<script>
  import axios from 'axios'
  import { useQuery } from '@tanstack/svelte-query'

  export let postId
  export let setPostId

  const getPostById = async id => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    )
    return data
  }
  const post = useQuery(['post', postId], () => getPostById(postId), {
    enabled: !!postId,
  })
</script>

<div>
  <div>
    <span style="cursor: pointer;" on:click={() => setPostId(-1)}> Back </span>
  </div>
  {#if !postId || $post.status === 'loading'}
    <span>Loading...</span>
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
