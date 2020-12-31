---
id: window-focus-refetching
title: Window Focus Refetching
---

If a user leaves your application and returns to stale data, **Svelte Query automatically requests fresh data for you in the background**. You can disable this globally or per-query using the `refetchOnWindowFocus` option:

#### Disabling Globally

```markdown
<script>
// Configure for all queries
import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
</script>

<QueryClientProvider client={queryClient}>...</QueryClientProvider>

```

#### Disabling Per-Query

```js
useQuery('todos', fetchTodos, { refetchOnWindowFocus: false })
```

## Custom Window Focus Event

In rare circumstances, you may want to manage your own window focus events that trigger Svelte Query to revalidate. To do this, Svelte Query provides a `focusManager.setEventListener` function that supplies you the callback that should be fired when the window is focused and allows you to set up your own events. When calling `focusManager.setEventListener`, the previously set handler is removed (which in most cases will be the default handler) and your new handler is used instead. For example, this is the default handler:

```js
focusManager.setEventListener(handleFocus => {
  // Listen to visibillitychange and focus
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('visibilitychange', handleFocus, false)
    window.addEventListener('focus', handleFocus, false)
  }

  return () => {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener('visibilitychange', handleFocus)
    window.removeEventListener('focus', handleFocus)
  }
})
```

## Ignoring Iframe Focus Events

A great use-case for replacing the focus handler is that of iframe events. Iframes present problems with detecting window focus by both double-firing events and also firing false-positive events when focusing or using iframes within your app. If you experience this, you should use an event handler that ignores these events as much as possible. I recommend [this one](https://gist.github.com/tannerlinsley/1d3a2122332107fcd8c9cc379be10d88)! It can be set up in the following way:

```js
import { focusManager } from '@sveltestack/svelte-query'
import onWindowFocus from './onWindowFocus' // The gist above

focusManager.setEventListener(onWindowFocus) // Boom!
```

## Managing focus state

```js
import { focusManager } from '@sveltestack/svelte-query'

// Override the default focus state
focusManager.setFocused(true)

// Fallback to the default focus check
focusManager.setFocused(undefined)
```
