import { writable } from "svelte/store"

export type Reducer<State = unknown, Action = unknown> = (value: State, action: Action) => State

export function reduce<State = unknown, Action = unknown>(
    reducer: Reducer<State, Action>,
    initial?: State
) {
    const state = writable(initial)
    const subscribe = run => state.subscribe(run)
    const dispatch = (action: Action) => {
        state.update(value => reducer(value, action))
    }

    return { subscribe, dispatch }
}