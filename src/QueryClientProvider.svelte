<script lang="ts">
	import type { DefaultOptions } from 'react-query';
	import { MutationCache, QueryCache, QueryClient } from 'react-query';
	import { onDestroy, onMount, setContext } from 'svelte';

	// Props with default values
	export let queryCache = new QueryCache();
	export let mutationCache = new MutationCache();
	export let defaultOptions: DefaultOptions = {};
	export let client = new QueryClient({
		queryCache,
		mutationCache,
		defaultOptions
	});

	onMount(() => {
		client.mount();
	});

	setContext('queryClient', client);

	onDestroy(() => {
		client.unmount();
	});
</script>

<slot />
