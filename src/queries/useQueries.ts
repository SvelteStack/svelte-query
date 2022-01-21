import { readable } from 'svelte/store';

import { notifyManager, QueriesObserver, QueryClient } from "../queryCore/core";
import { useQueryClient } from "../queryClientProvider";
import type { UseQueriesStoreResult, QueriesOptions, QueriesResults } from "../types";

export default function useQueries<T extends any[]>(
    queries: readonly [...QueriesOptions<T>]
): UseQueriesStoreResult<T> {
    const client: QueryClient = useQueryClient();

    function getDefaultQuery(newQueries: readonly [...QueriesOptions<T>]) {
        return newQueries.map(options => {
            const defaultedOptions = client.defaultQueryObserverOptions(
                options
            )
            // Make sure the results are already in fetching state before subscribing or updating options
            defaultedOptions.optimisticResults = true

            return defaultedOptions
        })
    }

    const defaultedQueries = getDefaultQuery(queries)
    const observer = new QueriesObserver(client, defaultedQueries);

    const { subscribe } = readable((observer.getCurrentResult() as QueriesResults<T>), (set) => {
        return observer.subscribe(notifyManager.batchCalls(set));
    });

    const setQueries = (newQueries: readonly [...QueriesOptions<T>]) => {
        if (observer.hasListeners()) {
            const defaultedNewQueries = getDefaultQuery(newQueries)
            observer.setQueries(defaultedNewQueries, { listeners: false })
        }
    }

    return { subscribe, setQueries };
}