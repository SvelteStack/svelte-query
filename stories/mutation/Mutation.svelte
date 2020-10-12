<script lang="ts">
  import {
    Mutation,
  } from "../../src";
  import { useMutation } from "../../src/Mutation.svelte";

  const later = (delay, value) =>
    new Promise((resolve) => setTimeout(resolve, delay, value));
  // the async fn
  const mutationFn = () => later(500, "My response");
  const useMutationResult = useMutation(mutationFn)
</script>

<main>
  <h3>Mutation</h3>
  <Mutation mutationFn={mutationFn} >
    <div slot="mutation" let:mutation>
      <button on:click={() => mutation.mutate()}>mutate</button>
      {mutation && mutation.isLoading ? 'mutation loading ...' : mutation && mutation.data || ''}
    </div>
  </Mutation>

  <h3>useMutation</h3>
  <button on:click={() => $useMutationResult.mutate()}>useMutate</button>
  {$useMutationResult.isLoading ? 'useMutation loading ...' : $useMutationResult.data || ''}
</main>
