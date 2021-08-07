<script lang="ts">
  import { useMutation } from '../../../src'

  const later = (delay, value) =>
    new Promise(resolve => setTimeout(resolve, delay, value))
  // the async fn
  const mutationFn = () => later(500, 'My response')
  const mutationResult = useMutation(mutationFn)
</script>

<main>
  <h3>useMutation</h3>
  <button on:click={() => $mutationResult.mutate()}>mutate</button>
  {$mutationResult.isLoading ? 'useMutation loading ...' : $mutationResult.data || ''}
</main>
