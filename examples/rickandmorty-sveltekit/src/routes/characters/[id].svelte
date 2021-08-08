<script lang="ts">
	import Location from '$lib/Location.svelte';
	import Episode from '$lib/Episode.svelte';
	import { useQuery } from 'svelte-query';
	import { page } from '$app/stores';

	const characterId = $page.params.id;

	const result = useQuery(`character-${characterId}`, () =>
		fetch(`https://rickandmortyapi.com/api/character/${characterId}`).then((res) => res.json())
	);
</script>

{#if $result.status === 'loading'}
	<p>Loading...</p>
{:else if $result.status === 'error'}
	<p>Error :(</p>
{:else}
	<div>
		<h2>{$result.data.name}</h2>
		<table style="max-width: 400px" aria-label="simple table">
			<thead>
				<tr>
					<th>Feature</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Gender</td>
					<td>{$result.data.gender}</td>
				</tr>
				<tr>
					<td>Status</td>
					<td>{$result.data.status}</td>
				</tr>
				<tr>
					<td>Species</td>
					<td>{$result.data.species}</td>
				</tr>
				<tr>
					<td>Origin</td>
					<td>{$result.data.origin.name}</td>
				</tr>
				<tr>
					<td>Location</td>
					<td>
						<Location id={$result.data.location.url.split('/').slice(-1)[0]} />
					</td>
				</tr>
			</tbody>
		</table>

		<br />
		<h4>Episodes</h4>
		{#each $result.data.episode as episode}
			<Episode id={episode.split('/').slice(-1)[0]} />
		{/each}
	</div>
{/if}
