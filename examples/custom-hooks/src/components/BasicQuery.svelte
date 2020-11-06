<script lang="ts">
  import Post from './Post.svelte'
  import Posts from './Posts.svelte'

  let postId = -1
  const setPostId = (id: number) => {
    postId = id
  }
</script>

<p>
  This example is exactly the same as the basic example, but each query has been
  refactored to be it's own custom hook. This design is the suggested way to use
  React Query, as it makes it much easier to manage query keys and shared query
  logic.
</p>
{#if postId > -1}
  <Post {postId} {setPostId} />
{:else}
  <Posts {setPostId} />
{/if}
