<script>
  import { QueryClientProvider } from '@reactstack/svelte-query'

  import Simple from './Simple.svelte'
</script>

<QueryClientProvider>
  <Simple />
</QueryClientProvider>
