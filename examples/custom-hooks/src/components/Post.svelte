<script lang="ts">
  import usePost from './usePost'

  export let postId
  export let setPostId

  const post = usePost(postId)
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
