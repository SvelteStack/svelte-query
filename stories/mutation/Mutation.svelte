<script lang="ts">
  import {
    QueryClientProvider,
    Mutation,
  } from "../../src";
  import type { MutationResult } from "../../src";

  const later = (delay, value) =>
    new Promise((resolve) => setTimeout(resolve, delay, value));
  // the async fn
  const mutationFn = () => later(500, "My response");

  // the mutation result/props
  let mutation: MutationResult<string>;
</script>

<main>
  <QueryClientProvider>
    <h3>Mutation</h3>
    <Mutation bind:mutation mutationFn={mutationFn} />
    <button on:click={() => mutation.mutate()}>mutate</button>
    {mutation && mutation.isLoading ? 'mutation loading ...' : mutation && mutation.data || ''}
  </QueryClientProvider>
</main>
