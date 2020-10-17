import { readable } from 'svelte/store';

import { QueriesObserver, QueryClient } from "../queryCore/core";
import type { QueryOptions } from "../types";
import { useQueryClient } from "../queryClientProvider";

export default function useQueries<TData, TError>(
    queries: QueryOptions[]
) {
    const client: QueryClient = useQueryClient();
    const observer = new QueriesObserver(client, queries);

    const { subscribe } = readable(observer.getCurrentResult(), (set) => {
        return observer.subscribe(set);
    });

    const setQueries = (newQueries: QueryOptions[]) => {
        observer.setQueries(newQueries)
    }

    return { subscribe, setQueries };
}