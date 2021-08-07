<script lang="ts">
  import { useIsMutating, useMutation } from '../../../src'

  const later = (delay, value) =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the mutation
  const mutationFn = () => later(500, 'My response')
  const useMutationResult = useMutation(mutationFn)

  // the mutation 2
  const mutationFn2 = () => later(500, 'My response 2')
  const useMutationResult2 = useMutation(mutationFn2)

  // useIsMutating
  const isMutating = useIsMutating()
  let useHistory: any[] = []
  $: {
    useHistory = [...useHistory, $isMutating]
  }
</script>

<main>
  <h3>useIsMutating</h3>
  <div>
    useIsMutating change log:
    <span>{JSON.stringify(useHistory)}</span>
    <div>
      <button
        on:click={() => {
          $useMutationResult.mutate()
          $useMutationResult2.mutate()
        }}
      >
        Mutate All
      </button>

      <h3>Mutation 1</h3>
      <button on:click={() => $useMutationResult.mutate()}>mutate</button>
      {$useMutationResult.isLoading
        ? 'Mutation loading ...'
        : $useMutationResult.data || ''}

      <h3>Mutation 2</h3>
      <button on:click={() => $useMutationResult2.mutate()}>mutate 2</button>
      {$useMutationResult2.isLoading
        ? 'Mutation 2 loading ...'
        : $useMutationResult2.data || ''}
    </div>
  </div>
</main>
