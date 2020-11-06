---
id: typescript
title: TypeScript
---

Svelte Query is now written in **TypeScript** to make sure the library and your projects are type-safe!

Things to keep in mind:

- Types currently require using TypeScript v3.8 or greater
- Changes to types in this repository are considered **non-breaking** and are usually released as **patch** semver changes (otherwise every type enhancement would be a major version!).
- It is **highly recommended that you lock your svelte-query package version to a specific patch release and upgrade with the expectation that types may be fixed or upgraded between any release**
- The non-type-related public API of Svelte Query still follows semver very strictly.

## Defining Custom Hooks

When defining a custom hook you need to specify the result and error types, for example:

```typescript
const queryResult = useQuery<Group[], Error>('groups', fetchGroups)
```
