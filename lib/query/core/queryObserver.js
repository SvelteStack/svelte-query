"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryObserver = void 0;
const utils_1 = require("./utils");
const notifyManager_1 = require("./notifyManager");
class QueryObserver {
    constructor(config) {
        this.client = config.client;
        this.options = config.client.defaultQueryObserverOptions(config.options);
        this.listeners = [];
        this.initialDataUpdateCount = 0;
        // Bind exposed methods
        this.remove = this.remove.bind(this);
        this.refetch = this.refetch.bind(this);
        this.fetchNextPage = this.fetchNextPage.bind(this);
        this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
        // Subscribe to the query
        this.updateQuery();
    }
    subscribe(listener) {
        const callback = listener || (() => undefined);
        this.listeners.push(callback);
        if (this.listeners.length === 1) {
            this.onMount();
        }
        return () => {
            this.unsubscribe(callback);
        };
    }
    unsubscribe(listener) {
        this.listeners = this.listeners.filter(x => x !== listener);
        if (!this.listeners.length) {
            this.clear();
        }
    }
    onMount() {
        this.currentQuery.subscribeObserver(this);
        if (this.willFetchOnMount()) {
            this.executeFetch();
        }
        this.updateTimers();
    }
    willFetchOnMount() {
        return (this.options.enabled !== false &&
            (!this.currentQuery.state.updatedAt ||
                this.options.refetchOnMount === 'always' ||
                (this.options.refetchOnMount !== false && this.isStale())));
    }
    willFetchOptionally() {
        return this.options.enabled !== false && this.isStale();
    }
    isStale() {
        return this.currentQuery.isStaleByTime(this.options.staleTime);
    }
    clear() {
        this.listeners = [];
        this.clearTimers();
        this.currentQuery.unsubscribeObserver(this);
    }
    setOptions(options) {
        const prevOptions = this.options;
        const prevQuery = this.currentQuery;
        this.options = this.client.defaultQueryObserverOptions(options);
        // Keep previous query key if the user does not supply one
        if (!this.options.queryKey) {
            this.options.queryKey = prevOptions.queryKey;
        }
        this.updateQuery();
        // Take no further actions if there are no subscribers
        if (!this.listeners.length) {
            return;
        }
        // If we subscribed to a new query, optionally fetch and update refetch
        if (this.currentQuery !== prevQuery) {
            this.optionalFetch();
            this.updateTimers();
            return;
        }
        // Optionally fetch if the query became enabled
        if (this.options.enabled !== false && prevOptions.enabled === false) {
            this.optionalFetch();
        }
        // Update stale interval if needed
        if (this.options.enabled !== prevOptions.enabled ||
            this.options.staleTime !== prevOptions.staleTime) {
            this.updateStaleTimeout();
        }
        // Update refetch interval if needed
        if (this.options.enabled !== prevOptions.enabled ||
            this.options.refetchInterval !== prevOptions.refetchInterval) {
            this.updateRefetchInterval();
        }
    }
    getCurrentResult() {
        return this.currentResult;
    }
    getCurrentOrNextResult(options) {
        if (this.currentQuery.isFetching()) {
            return this.getNextResult(options);
        }
        else if (this.currentResult.isError && (options === null || options === void 0 ? void 0 : options.throwOnError)) {
            return Promise.reject(this.currentResult.error);
        }
        return Promise.resolve(this.currentResult);
    }
    getNextResult(options) {
        return new Promise((resolve, reject) => {
            const unsubscribe = this.subscribe(result => {
                if (!result.isFetching) {
                    unsubscribe();
                    if (result.isError && (options === null || options === void 0 ? void 0 : options.throwOnError)) {
                        reject(result.error);
                    }
                    else {
                        resolve(result);
                    }
                }
            });
        });
    }
    getCurrentQuery() {
        return this.currentQuery;
    }
    remove() {
        this.currentQuery.remove();
    }
    refetch(options) {
        return this.fetch(options);
    }
    fetchNextPage(options) {
        return this.fetch({
            throwOnError: options === null || options === void 0 ? void 0 : options.throwOnError,
            fetchMore: { direction: 'forward', pageParam: options === null || options === void 0 ? void 0 : options.pageParam },
        });
    }
    fetchPreviousPage(options) {
        return this.fetch({
            throwOnError: options === null || options === void 0 ? void 0 : options.throwOnError,
            fetchMore: { direction: 'backward', pageParam: options === null || options === void 0 ? void 0 : options.pageParam },
        });
    }
    fetch(fetchOptions) {
        if (!this.canFetch()) {
            return this.getCurrentOrNextResult();
        }
        const promise = this.getNextResult(fetchOptions);
        this.executeFetch(fetchOptions);
        return promise;
    }
    optionalFetch() {
        if (this.willFetchOptionally()) {
            this.executeFetch();
        }
    }
    executeFetch(fetchOptions) {
        if (this.canFetch()) {
            this.currentQuery.fetch(this.getQueryOptions(), fetchOptions).catch(utils_1.noop);
        }
    }
    canFetch() {
        var _a;
        return Boolean(this.options.queryFn || ((_a = this.currentQuery.defaultOptions) === null || _a === void 0 ? void 0 : _a.queryFn));
    }
    updateStaleTimeout() {
        this.clearStaleTimeout();
        if (utils_1.isServer ||
            this.currentResult.isStale ||
            !utils_1.isValidTimeout(this.options.staleTime)) {
            return;
        }
        const time = utils_1.timeUntilStale(this.currentResult.updatedAt, this.options.staleTime);
        // The timeout is sometimes triggered 1 ms before the stale time expiration.
        // To mitigate this issue we always add 1 ms to the timeout.
        const timeout = time + 1;
        //@ts-ignore
        this.staleTimeoutId = setTimeout(() => {
            if (!this.currentResult.isStale) {
                this.updateResult();
                this.notify({ listeners: true, cache: true });
            }
        }, timeout);
    }
    updateRefetchInterval() {
        this.clearRefetchInterval();
        if (utils_1.isServer ||
            this.options.enabled === false ||
            !utils_1.isValidTimeout(this.options.refetchInterval)) {
            return;
        }
        //@ts-ignore
        this.refetchIntervalId = setInterval(() => {
            if (this.options.refetchIntervalInBackground || utils_1.isDocumentVisible()) {
                this.executeFetch();
            }
        }, this.options.refetchInterval);
    }
    updateTimers() {
        this.updateStaleTimeout();
        this.updateRefetchInterval();
    }
    clearTimers() {
        this.clearStaleTimeout();
        this.clearRefetchInterval();
    }
    clearStaleTimeout() {
        clearInterval(this.staleTimeoutId);
        this.staleTimeoutId = undefined;
    }
    clearRefetchInterval() {
        clearInterval(this.refetchIntervalId);
        this.refetchIntervalId = undefined;
    }
    getQueryOptions() {
        return this.options;
    }
    updateResult(willFetch) {
        var _a, _b, _c;
        const { state } = this.currentQuery;
        let { status, isFetching, updatedAt } = state;
        let isPreviousData = false;
        let data;
        // Already set the status to loading if we are going to fetch
        if (willFetch) {
            isFetching = true;
            if (status === 'idle') {
                status = 'loading';
            }
        }
        // Keep previous data if needed
        if (this.options.keepPreviousData &&
            !state.dataUpdateCount && ((_a = this.previousQueryResult) === null || _a === void 0 ? void 0 : _a.isSuccess)) {
            data = this.previousQueryResult.data;
            updatedAt = this.previousQueryResult.updatedAt;
            status = this.previousQueryResult.status;
            isPreviousData = true;
        }
        else if (this.options.select && typeof state.data !== 'undefined') {
            // Use the previous select result if the query data did not change
            if (this.currentResult && state.data === ((_b = this.currentResultState) === null || _b === void 0 ? void 0 : _b.data)) {
                data = this.currentResult.data;
            }
            else {
                data = this.options.select(state.data);
                if (this.options.structuralSharing !== false) {
                    data = utils_1.replaceEqualDeep((_c = this.currentResult) === null || _c === void 0 ? void 0 : _c.data, data);
                }
            }
        }
        else {
            data = state.data;
        }
        const result = Object.assign(Object.assign({}, utils_1.getStatusProps(status)), { data, error: state.error, failureCount: state.failureCount, fetchNextPage: this.fetchNextPage, fetchPreviousPage: this.fetchPreviousPage, hasNextPage: state.hasNextPage, hasPreviousPage: state.hasPreviousPage, isFetched: state.dataUpdateCount > 0, isFetchedAfterMount: state.dataUpdateCount > this.initialDataUpdateCount, isFetching, isFetchingNextPage: state.isFetchingNextPage, isFetchingPreviousPage: state.isFetchingPreviousPage, isPreviousData, isStale: this.isStale(), refetch: this.refetch, remove: this.remove, updatedAt });
        // Keep reference to the current state on which the current result is based on
        this.currentResultState = state;
        // Only update if something has changed
        if (!this.currentResult ||
            !utils_1.shallowEqualObjects(this.currentResult, result)) {
            this.currentResult = result;
        }
    }
    updateQuery() {
        const prevQuery = this.currentQuery;
        const queryOptions = this.getQueryOptions();
        const query = this.client.getCache().build(queryOptions);
        if (query === prevQuery) {
            return;
        }
        this.previousQueryResult = this.currentResult;
        this.currentQuery = query;
        this.initialDataUpdateCount = query.state.dataUpdateCount;
        const willFetch = prevQuery
            ? this.willFetchOptionally()
            : this.willFetchOnMount();
        this.updateResult(willFetch);
        if (!this.listeners.length) {
            return;
        }
        prevQuery === null || prevQuery === void 0 ? void 0 : prevQuery.unsubscribeObserver(this);
        this.currentQuery.subscribeObserver(this);
        if (this.options.notifyOnStatusChange !== false) {
            this.notify({ listeners: true });
        }
    }
    onQueryUpdate(action) {
        const { options } = this;
        const { type } = action;
        // Store current result and get new result
        const prevResult = this.currentResult;
        this.updateResult();
        const currentResult = this.currentResult;
        // Update timers if needed
        if (type === 'success' || type === 'error' || type === 'invalidate') {
            this.updateTimers();
        }
        // Do not notify if the nothing has changed
        if (prevResult === currentResult) {
            return;
        }
        // Determine which callbacks to trigger
        const notifyOptions = {};
        if (type === 'success') {
            notifyOptions.onSuccess = true;
        }
        else if (type === 'error') {
            notifyOptions.onError = true;
        }
        if (
        // Always notify if notifyOnStatusChange is set
        options.notifyOnStatusChange !== false ||
            // Otherwise only notify on data or error change
            currentResult.data !== prevResult.data ||
            currentResult.error !== prevResult.error) {
            notifyOptions.listeners = true;
        }
        this.notify(notifyOptions);
    }
    notify(notifyOptions) {
        const { options, currentResult, currentQuery, listeners } = this;
        const { onSuccess, onSettled, onError } = options;
        notifyManager_1.notifyManager.batch(() => {
            // First trigger the configuration callbacks
            if (notifyOptions.onSuccess) {
                if (onSuccess) {
                    notifyManager_1.notifyManager.schedule(() => {
                        onSuccess(currentResult.data);
                    });
                }
                if (onSettled) {
                    notifyManager_1.notifyManager.schedule(() => {
                        onSettled(currentResult.data, null);
                    });
                }
            }
            else if (notifyOptions.onError) {
                if (onError) {
                    notifyManager_1.notifyManager.schedule(() => {
                        onError(currentResult.error);
                    });
                }
                if (onSettled) {
                    notifyManager_1.notifyManager.schedule(() => {
                        onSettled(undefined, currentResult.error);
                    });
                }
            }
            // Then trigger the listeners
            if (notifyOptions.listeners) {
                listeners.forEach(listener => {
                    notifyManager_1.notifyManager.schedule(() => {
                        listener(currentResult);
                    });
                });
            }
            // Then the cache listeners
            if (notifyOptions.cache) {
                this.client.getCache().notify(currentQuery);
            }
        });
    }
}
exports.QueryObserver = QueryObserver;
