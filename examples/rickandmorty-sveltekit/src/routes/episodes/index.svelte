<script lang="ts">
	import { useQuery } from 'svelte-query';

	const result = useQuery('episodes', () =>
		fetch('https://rickandmortyapi.com/api/episode').then((res) => res.json())
	);
</script>

<div>
	<h2>Episodes</h2>
	{#if $result.status === 'loading'}
		<p>Loading...</p>
	{:else if $result.status === 'error'}
		<p>Error :(</p>
	{:else}
		{#each $result.data.results as episode}
			<article>
				<a href={`/episodes/${episode.id}`}>
					<h6>
						{episode.episode} - {episode.name} <em>{episode.air_date}</em>
					</h6>
				</a>
			</article>
		{/each}
	{/if}
</div>
