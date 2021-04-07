<img src="./docs/src/images/svelte-query-og.png" />

Hooks for managing, caching and syncing asynchronous and remote data in Svelte

## Visit [sveltequery.vercel.app](https://sveltequery.vercel.app) for docs, guides, API and more!

## Quick Features

- Transport/protocol/backend agnostic data fetching (REST, GraphQL, promises, whatever!)
- Auto Caching + Refetching (stale-while-revalidate, Window Refocus, Polling/Realtime)
- Parallel + Dependent Queries
- Mutations + Reactive Query Refetching
- Multi-layer Cache + Automatic Garbage Collection
- Paginated + Cursor-based Queries
- Load-More + Infinite Scroll Queries w/ Scroll Recovery
- Request Cancellation


## Contributing

**PRs are welcome!**
You noticed a bug, a possible improvement or whatever?
Any help is always appreciated, so don't hesitate opening one!

Be sure to check out the [contributing guidelines](CONTRIBUTING.md) to fasten up the merging process.

**Get started (Devs)**

```bash
git clone git@github.com:SvelteStack/svelte-query.git
cd svelte-query
yarn
yarn storybook
```

**Running Storybook**

```bash
cd storybook
yarn
yarn start
```

**Running the tests**

```bash
yarn test
```

**Running the Docs**

```bash
cd docs
yarn
yarn build
yarn start
```
http://localhost:3000

**Build**

```bash
yarn build
```
