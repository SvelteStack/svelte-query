<script lang="ts">
  import { Mutation } from '../../src'
  import { useMutation } from '../../src/mutation'

  const later = (delay, value) =>
    new Promise(resolve => setTimeout(resolve, delay, value))
  // the async fn
  const mutationFn = () => later(500, 'My response')
  const useMutationResult = useMutation(mutationFn)
</script>

<main>
  <h3>Mutation</h3>
  <Mutation {mutationFn}>
    <div slot="mutation" let:mutationResult>
      <button on:click={() => mutationResult.mutate()}>mutate</button>
      {(mutationResult && mutationResult.data) || ''}
    </div>
  </Mutation>

  <h3>useMutation</h3>
  <button on:click={() => $useMutationResult.mutate()}>useMutate</button>
  {$useMutationResult.data || ''}
</main>
