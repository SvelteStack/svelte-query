<script lang="ts">
  import { onMount } from 'svelte'

  import type { MutationFunction } from '../queryCore'
  import type { UseMutationOptions, UseMutationResult } from '../types'
  import useMutation from './useMutation'

  type TData = $$Generic<any>
  type TError = $$Generic<any>
  type TVariables = $$Generic<any>
  type TContext = $$Generic<any>

  export let mutationFn: MutationFunction<TData, TVariables>
  export let options:
    | UseMutationOptions<TData, TError, TVariables, TContext>
    | undefined = undefined

  // useful for binding
  export let mutationResult:
    | UseMutationResult<TData, TError, TVariables, TContext>
    | undefined = undefined

  let firstRender = true

  onMount(() => {
    firstRender = false
  })

  const mutation = useMutation(mutationFn, options)
  $: mutationResult = $mutation

  $: {
    if (!firstRender) {
      mutation.setOptions(mutationFn, options)
    }
  }
</script>

<slot name="mutation" {mutationResult} />
