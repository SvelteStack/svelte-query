<script lang="ts">
	import { useQuery } from 'svelte-query';
	import Character from '$lib/Character.svelte';
	import { page } from '$app/stores';

	const episodeId = $page.params.id;

	const result = useQuery(`episode-${episodeId}`, () =>
		fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`).then((res) => res.json())
	);
</script>

{#if $result.status === 'loading'}
	<p>Loading...</p>
{:else if $result.status === 'error'}
	<p>Error :(</p>
{:else}
	<div>
		<h2>{$result.data.name}</h2>
		<p>{$result.data.air_date}</p>
		<br />
		<h4>Characters</h4>
		{#each $result.data.characters as character}
			<Character id={character.split('/').slice(-1)[0]} />
		{/each}
	</div>
{/if}
