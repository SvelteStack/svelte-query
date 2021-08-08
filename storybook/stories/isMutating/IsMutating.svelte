<script lang="ts">
  import { useIsMutating, useMutation } from '../../../src'

  const later = (delay: number, value: unknown) =>
    new Promise(resolve => setTimeout(resolve, delay, value))

  // the mutation
  const mutationFn = () => later(500, 'My response')
  const firstMutation = useMutation(mutationFn)

  // the mutation 2
  const mutationFn2 = () => later(500, 'My response 2')
  const secondMutation = useMutation(mutationFn2)

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
          $firstMutation.mutate();
          $secondMutation.mutate();
        }}
      >
        Mutate All
      </button>

      <h3>Mutation 1</h3>
      <button on:click={() => $firstMutation.mutate()}>mutate</button>
      {$firstMutation.isLoading
        ? 'Mutation loading ...'
        : $firstMutation.data || ''}

      <h3>Mutation 2</h3>
      <button on:click={() => $secondMutation.mutate()}>mutate 2</button>
      {$secondMutation.isLoading
        ? 'Mutation 2 loading ...'
        : $secondMutation.data || ''}
    </div>
  </div>
</main>
