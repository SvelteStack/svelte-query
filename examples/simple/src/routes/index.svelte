<script>
  import { QueryClientProvider } from 'svelte-query'
  import Simple from '../components/Simple.svelte'
</script>

<QueryClientProvider>
  <Simple />
</QueryClientProvider>
