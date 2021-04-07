<script lang="ts">
  import { QueryClientProvider } from '../../../src'
  import Mutation from './Mutation.svelte'
</script>

<QueryClientProvider>
  <Mutation />
</QueryClientProvider>
