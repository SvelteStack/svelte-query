import { readable } from 'svelte/store';

import { notifyManager, QueriesObserver, QueryClient } from "../queryCore/core";
import { useQueryClient } from "../queryClientProvider";
import type { UseQueryOptions } from "../types";

export default function useQueries<TData, TError>(
    queries: UseQueryOptions[]
) {
    const client: QueryClient = useQueryClient();
    const observer = new QueriesObserver(client, queries);

    const { subscribe } = readable(observer.getCurrentResult(), (set) => {
        return observer.subscribe(notifyManager.batchCalls(set));
    });

    const setQueries = (newQueries: UseQueryOptions[]) => {
        if (observer.hasListeners()) {
            observer.setQueries(newQueries)
        }
    }

    return { subscribe, setQueries };
}