"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrate = exports.dehydrate = void 0;
const query_1 = require("../core/query");
require("../core/queryCache");
require("../core/types");
// FUNCTIONS
function serializePositiveNumber(value) {
    return value === Infinity ? -1 : value;
}
function deserializePositiveNumber(value) {
    return value === -1 ? Infinity : value;
}
// Most config is not dehydrated but instead meant to configure again when
// consuming the de/rehydrated data, typically with useQuery on the client.
// Sometimes it might make sense to prefetch data on the server and include
// in the html-payload, but not consume it on the initial render.
function dehydrateQuery(query) {
    return {
        config: {
            cacheTime: serializePositiveNumber(query.cacheTime),
        },
        data: query.state.data,
        queryKey: query.queryKey,
        queryHash: query.queryHash,
        updatedAt: query.state.updatedAt,
    };
}
function defaultShouldDehydrate(query) {
    return query.state.status === 'success';
}
function dehydrate(cache, options) {
    options = options || {};
    const shouldDehydrate = options.shouldDehydrate || defaultShouldDehydrate;
    const queries = [];
    cache.getAll().forEach(query => {
        if (shouldDehydrate(query)) {
            queries.push(dehydrateQuery(query));
        }
    });
    return { queries };
}
exports.dehydrate = dehydrate;
function hydrate(cache, dehydratedState, options) {
    if (typeof dehydratedState !== 'object' || dehydratedState === null) {
        return;
    }
    const defaultOptions = (options === null || options === void 0 ? void 0 : options.defaultOptions) || {};
    const queries = dehydratedState.queries || [];
    queries.forEach(dehydratedQuery => {
        let query = cache.get(dehydratedQuery.queryHash);
        // Do not hydrate if an existing query exists with newer data
        if (query && query.state.updatedAt >= dehydratedQuery.updatedAt) {
            return;
        }
        if (!query) {
            query = new query_1.Query({
                cache: cache,
                queryKey: dehydratedQuery.queryKey,
                queryHash: dehydratedQuery.queryHash,
                options: Object.assign(Object.assign({}, defaultOptions), { cacheTime: deserializePositiveNumber(dehydratedQuery.config.cacheTime) }),
            });
            cache.add(query);
        }
        query.setData(dehydratedQuery.data, {
            updatedAt: dehydratedQuery.updatedAt,
        });
    });
}
exports.hydrate = hydrate;
