<script lang="ts">
  import { useMutation } from '../../../src'

  const later = (delay: number, value: unknown) =>
    new Promise(resolve => setTimeout(resolve, delay, value))
  // the async fn
  const mutationFn = () => later(500, 'My response')
  const testMutation = useMutation(mutationFn)
</script>

<main>
  <h3>useMutation</h3>
  <button on:click={() => $testMutation.mutate()}>mutate</button>
  {$testMutation.isLoading
    ? 'useMutation loading ...'
    : $testMutation.data || ''}
</main>
