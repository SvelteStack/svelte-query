<script>
  import { QueryClientProvider } from '@sveltestack/svelte-query'

  import Simple from './Simple.svelte'
</script>

<QueryClientProvider>
  <Simple />
</QueryClientProvider>
