import { useQueryClient } from "../queryClientProvider";
import { hydrate } from '../queryCore/hydration';
import type { QueryClient } from "../queryCore/core";
import type { HydrateOptions } from '../queryCore/hydration';

export default function useHydrate(state: unknown, options?: HydrateOptions) {
    const client: QueryClient = useQueryClient();
    const cache = client.getCache()
    if (state) {
        hydrate(cache, state, options)
    }
}