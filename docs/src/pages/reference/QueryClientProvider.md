---
id: QueryClientProvider
title: QueryClientProvider
---

Use the `QueryClientProvider` component to connect and provide a `QueryClient` to your application:

```markdown
<script>
import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

const queryClient = new QueryClient()

</script>

<QueryClientProvider client={queryClient}>...</QueryClientProvider>
```
