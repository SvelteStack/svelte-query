<script lang="ts">
  import { QueryClientProvider } from '../../../../src'
  import BasicQuery from './BasicQuery.svelte'
</script>

<QueryClientProvider>
  <BasicQuery />
</QueryClientProvider>
