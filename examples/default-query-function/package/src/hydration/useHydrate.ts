import { useQueryClient } from "../queryClientProvider";
import { DehydratedState, hydrate } from '../queryCore/hydration';
import type { QueryClient } from "../queryCore/core";
import type { HydrateOptions } from '../queryCore/hydration';

export default function useHydrate(state: DehydratedState, options?: HydrateOptions) {
    const client: QueryClient = useQueryClient();
    if (state) {
        hydrate(client, state, options)
    }
}