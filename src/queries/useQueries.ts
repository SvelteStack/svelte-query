import { readable } from 'svelte/store';

import type { QueryClient } from "../queryCore/core";
import type { QueryOptions } from "../types";
import { useQueryClient } from "../queryClientProvider";

export default function useQueries<TData, TError>(
    queries: QueryOptions[]
) {
    const client: QueryClient = useQueryClient();
    const observer = client.watchQueries(queries);

    const { subscribe } = readable(observer.getCurrentResult(), (set) => {
        return observer.subscribe(set);
    });

    const setQueries = (newQueries: QueryOptions[]) => {
        observer.setQueries(newQueries)
    }

    return { subscribe, setQueries };
}