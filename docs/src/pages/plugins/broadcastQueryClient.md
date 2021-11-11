---
id: broadcastQueryClient
title: broadcastQueryClient (Experimental)
---

> VERY IMPORTANT: This utility is currently in an experimental stage. This means that breaking changes will happen in minor AND patch releases. Use at your own risk. If you choose to rely on this in production in an experimental stage, please lock your version to a patch-level version to avoid unexpected breakages.

`broadcastQueryClient` is a utility for broadcasting and syncing the state of your queryClient between browser tabs/windows with the same origin.

## Installation

This utility comes packaged with `svelte-query` and is available under the `@sveltestack/svelte-query` import.

However, this utility needs the `broadcast-channel` dependency to be available but it's not provided by this package.

So if you want to use this utility, you need to install it in your project:

```bash
# using npm:
npm install broadcast-channel

# using yarn:
yarn add broadcast-channel

# using pnpm:
pnpm add broadcast-channel
```

## Usage

Import the `broadcastQueryClient` function, and pass it your `QueryClient` instance, and optionally, set a `broadcastChannel`.

```ts
import { broadcastQueryClient } from '@sveltestack/svelte-query'

const queryClient = new QueryClient()

onMount(async () => {
  await broadcastQueryClient({
    queryClient,
    broadcastChannel: 'my-app',
  })
});
```

## API

### `broadcastQueryClient`

Pass this function a `QueryClient` instance and optionally, a `broadcastChannel`.

```ts
await broadcastQueryClient({ queryClient, broadcastChannel })
```

### `Options`

An object of options:

```ts
interface broadcastQueryClient {
  /** The QueryClient to sync */
  queryClient: QueryClient
  /** This is the unique channel name that will be used
   * to communicate between tabs and windows */
  broadcastChannel?: string
}
```

The default options are:

```ts
{
  broadcastChannel = 'svelte-query',
}
```
