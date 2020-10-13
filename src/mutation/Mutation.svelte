<script lang="ts">
  import type { MutationOptions } from '../queryCore/core'
  import type { MutationResult, MutationFunction } from '../types'
  import useMutation from './useMutation'

  export let mutationFn: MutationFunction
  export let options: MutationOptions

  // useful for binding
  export let mutation: MutationResult

  const mutationResult = useMutation(mutationFn, options)
  $: mutation = $mutationResult
</script>

<slot name="mutation" {mutation} />
