<script>
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import Simple from './Simple.svelte'
</script>

<QueryClientProvider>
  <Simple />
</QueryClientProvider>
