<script lang="ts">
  import { QueryClientProvider } from '../../src'
  import Queries from './Queries.svelte'
</script>

<QueryClientProvider>
  <Queries />
</QueryClientProvider>
