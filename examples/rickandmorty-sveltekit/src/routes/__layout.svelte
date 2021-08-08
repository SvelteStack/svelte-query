<div class="App">
	<nav>
		<a href="/">
			<button color="primary">Home</button>
		</a>
		<a href="/episodes">
			<button color="primary">Episodes</button>
		</a>
		<a href="/characters">
			<button color="primary">Characters</button>
		</a>
	</nav>

	<main>
		<slot />
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: system-ui;
	}

	nav {
		margin: 0 auto;
		display: flex;
		justify-content: center;
		background-color: #cccccc;
	}

	nav button {
		gap: 0.5rem;
	}

	main {
		margin: 0 auto;
		padding: 1rem;
	}
</style>
