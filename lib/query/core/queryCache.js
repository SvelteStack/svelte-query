"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryCache = void 0;
const utils_1 = require("./utils");
const query_1 = require("./query");
const notifyManager_1 = require("./notifyManager");
// CLASS
class QueryCache {
    constructor() {
        this.listeners = [];
        this.queries = [];
        this.queriesMap = {};
    }
    build(options) {
        var _a;
        const hashFn = utils_1.getQueryKeyHashFn(options);
        const queryKey = options.queryKey;
        const queryHash = (_a = options.queryHash) !== null && _a !== void 0 ? _a : hashFn(queryKey);
        let query = this.get(queryHash);
        if (!query) {
            query = new query_1.Query({
                cache: this,
                queryKey,
                queryHash,
                options,
            });
            this.add(query);
        }
        return query;
    }
    add(query) {
        if (!this.queriesMap[query.queryHash]) {
            this.queriesMap[query.queryHash] = query;
            this.queries.push(query);
            this.notify(query);
        }
    }
    remove(query) {
        if (this.queriesMap[query.queryHash]) {
            query.destroy();
            delete this.queriesMap[query.queryHash];
            this.queries = this.queries.filter(x => x !== query);
            this.notify(query);
        }
    }
    clear() {
        notifyManager_1.notifyManager.batch(() => {
            this.queries.forEach(query => {
                this.remove(query);
            });
        });
    }
    get(queryHash) {
        return this.queriesMap[queryHash];
    }
    getAll() {
        return this.queries;
    }
    find(arg1, arg2) {
        const [filters] = utils_1.parseFilterArgs(arg1, arg2);
        return this.queries.find(query => utils_1.matchQuery(filters, query));
    }
    findAll(arg1, arg2) {
        const [filters] = utils_1.parseFilterArgs(arg1, arg2);
        return filters && Object.keys(filters).length > 0
            ? this.queries.filter(query => utils_1.matchQuery(filters, query))
            : this.queries;
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(x => x !== listener);
        };
    }
    notify(query) {
        notifyManager_1.notifyManager.batch(() => {
            this.listeners.forEach(listener => {
                notifyManager_1.notifyManager.schedule(() => {
                    listener(query);
                });
            });
        });
    }
}
exports.QueryCache = QueryCache;
