<script lang="ts">
  import { onMount } from 'svelte'

  import type { MutationFunction } from '../queryCore'
  import type { UseMutationOptions } from '../types'
  import useMutation from './useMutation'

  export let mutationFn: MutationFunction
  export let options: UseMutationOptions<any, any, any, any>

  // useful for binding
  export let mutationResult

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
