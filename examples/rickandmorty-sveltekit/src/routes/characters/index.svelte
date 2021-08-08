<script lang="ts">
	import { useQuery } from 'svelte-query';

	const result = useQuery('characters', () => fetch('https://rickandmortyapi.com/api/character/').then(res => res.json()));
</script>

<div>
	<h2>Characters</h2>
	{#if $result.status === 'loading'}
		<p>Loading...</p>
	{:else if $result.status === 'error'}
		<p>Error :(</p>
	{:else}
		{#each $result.data.results as person}
			<article style="margin: 16px 0 0;">
				<h6>
					<a href={`/characters/${person.id}`}>
						{person.name} - {person.gender}: {person.species}
					</a>
				</h6>
			</article>
		{/each}
	{/if}
</div>
