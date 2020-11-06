<script lang="ts">
  import Post from './Post.svelte'
  import Posts from './Posts.svelte'

  let postId = -1
  const setPostId = (id: number) => {
    postId = id
  }
</script>

<p>
  As you visit the posts below, you will notice them in a loading state the
  first time you load them. However, after you return to this list and click on
  any posts you have already visited again, you will see them load instantly and
  background refresh right before your eyes!{' '}
  <strong>
    (You may need to throttle your network speed to simulate longer loading
    sequences)
  </strong>
</p>
{#if postId > -1}
  <Post {postId} {setPostId} />
{:else}
  <Posts {setPostId} />
{/if}
