"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const utils_1 = require("./utils");
const notifyManager_1 = require("./notifyManager");
const logger_1 = require("./logger");
// CLASS
class Query {
    constructor(config) {
        this.setOptions(config.options);
        this.observers = [];
        this.cache = config.cache;
        this.queryKey = config.queryKey;
        this.queryHash = config.queryHash;
        this.state = getDefaultState(this.options);
        this.scheduleGc();
    }
    setOptions(options) {
        var _a;
        this.options = Object.assign(Object.assign({}, this.defaultOptions), options);
        // Default to 5 minutes if not cache time is set
        this.cacheTime = Math.max(this.cacheTime || 0, (_a = this.options.cacheTime) !== null && _a !== void 0 ? _a : 5 * 60 * 1000);
    }
    setDefaultOptions(options) {
        this.defaultOptions = options;
    }
    dispatch(action) {
        this.state = queryReducer(this.state, action);
        notifyManager_1.notifyManager.batch(() => {
            this.observers.forEach(observer => {
                observer.onQueryUpdate(action);
            });
            this.cache.notify(this);
        });
    }
    scheduleGc() {
        this.clearGcTimeout();
        if (utils_1.isServer ||
            this.observers.length > 0 ||
            !utils_1.isValidTimeout(this.cacheTime)) {
            return;
        }
        //@ts-ignore
        this.gcTimeout = setTimeout(() => {
            this.remove();
        }, this.cacheTime);
    }
    cancel(options) {
        var _a;
        const promise = this.promise || Promise.resolve();
        (_a = this.cancelFetch) === null || _a === void 0 ? void 0 : _a.call(this, options);
        return promise.then(utils_1.noop).catch(utils_1.noop);
    }
    clearTimersObservers() {
        this.observers.forEach(observer => {
            observer.clearTimers();
        });
    }
    clearGcTimeout() {
        clearTimeout(this.gcTimeout);
        this.gcTimeout = undefined;
    }
    setData(updater, options) {
        var _a, _b;
        const prevData = this.state.data;
        // Get the new data
        let data = utils_1.functionalUpdate(updater, prevData);
        // Structurally share data between prev and new data if needed
        if (this.options.structuralSharing !== false) {
            data = utils_1.replaceEqualDeep(prevData, data);
        }
        // Use prev data if an isDataEqual function is defined and returns `true`
        if ((_b = (_a = this.options).isDataEqual) === null || _b === void 0 ? void 0 : _b.call(_a, prevData, data)) {
            data = prevData;
        }
        // Set data and mark it as cached
        this.dispatch({
            data,
            hasNextPage: hasNextPage(this.options, data),
            hasPreviousPage: hasPreviousPage(this.options, data),
            pageParams: options === null || options === void 0 ? void 0 : options.pageParams,
            type: 'success',
            updatedAt: options === null || options === void 0 ? void 0 : options.updatedAt,
        });
        return data;
    }
    remove() {
        this.cache.remove(this);
    }
    destroy() {
        this.clearGcTimeout();
        this.clearTimersObservers();
        this.cancel();
    }
    isActive() {
        return this.observers.some(observer => observer.options.enabled !== false);
    }
    isFetching() {
        return this.state.isFetching;
    }
    isStale() {
        return (this.state.isInvalidated ||
            !this.state.updatedAt ||
            this.observers.some(observer => observer.getCurrentResult().isStale));
    }
    isStaleByTime(staleTime = 0) {
        return (this.state.isInvalidated ||
            !this.state.updatedAt ||
            !utils_1.timeUntilStale(this.state.updatedAt, staleTime));
    }
    onFocus() {
        this.onExternalEvent('focus');
    }
    onOnline() {
        this.onExternalEvent('online');
    }
    onExternalEvent(type) {
        var _a;
        // Execute the first observer that wants to fetch on this event
        const fetchObserver = this.observers.find(observer => {
            const { enabled, refetchOnWindowFocus, refetchOnReconnect, } = observer.options;
            const { isStale } = observer.getCurrentResult();
            return (enabled !== false &&
                ((type === 'focus' &&
                    (refetchOnWindowFocus === 'always' ||
                        (refetchOnWindowFocus !== false && isStale))) ||
                    (type === 'online' &&
                        (refetchOnReconnect === 'always' ||
                            (refetchOnReconnect !== false && isStale)))));
        });
        if (fetchObserver) {
            fetchObserver.refetch();
        }
        // Continue any paused fetch
        (_a = this.continueFetch) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    subscribeObserver(observer) {
        if (this.observers.indexOf(observer) !== -1) {
            return;
        }
        this.observers.push(observer);
        // Stop the query from being garbage collected
        this.clearGcTimeout();
        this.cache.notify(this);
    }
    unsubscribeObserver(observer) {
        this.observers = this.observers.filter(x => x !== observer);
        if (!this.observers.length) {
            // If the transport layer does not support cancellation
            // we'll let the query continue so the result can be cached
            if (this.isTransportCancelable) {
                this.cancel();
            }
            this.scheduleGc();
        }
        this.cache.notify(this);
    }
    invalidate() {
        if (!this.state.isInvalidated) {
            this.dispatch({ type: 'invalidate' });
        }
    }
    fetch(options, fetchOptions) {
        if (this.state.isFetching)
            if ((fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.fetchMore) && this.state.updatedAt) {
                // Silently cancel current fetch if the user wants to fetch more
                this.cancel({ silent: true });
            }
            else if (this.promise) {
                // Return current promise if we are already fetching
                return this.promise;
            }
        // Update config if passed, otherwise the config from the last execution is used
        if (options) {
            this.setOptions(options);
        }
        // Use the options from the first observer with a query function if no function is found.
        // This can happen when the query is hydrated or created with setQueryData.
        if (!this.options.queryFn) {
            const observer = this.observers.find(x => x.options.queryFn);
            if (observer) {
                this.setOptions(observer.options);
            }
        }
        // Get the query function params
        let params = utils_1.ensureArray(this.queryKey);
        const filter = this.options.queryFnParamsFilter;
        params = filter ? filter(params) : params;
        const promise = this.options.infinite
            ? this.startInfiniteFetch(this.options, params, fetchOptions)
            : this.startFetch(this.options, params);
        this.promise = promise.catch(error => {
            // Set error state if needed
            if (!(utils_1.isCancelledError(error) && error.silent)) {
                this.dispatch({
                    type: 'error',
                    error,
                });
            }
            // Log error
            if (!utils_1.isCancelledError(error)) {
                logger_1.getLogger().error(error);
            }
            // Propagate error
            throw error;
        });
        return this.promise;
    }
    startFetch(options, params) {
        // Create function to fetch the data
        const queryFn = options.queryFn || defaultQueryFn;
        const fetchData = () => queryFn(...params);
        // Set to fetching state if not already in it
        if (!this.state.isFetching) {
            this.dispatch({ type: 'fetch' });
        }
        // Try to fetch the data
        return this.tryFetchData(options, fetchData).then(data => this.setData(data));
    }
    startInfiniteFetch(options, params, fetchOptions) {
        const queryFn = options.queryFn || defaultQueryFn;
        const fetchMore = fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.fetchMore;
        const pageParam = fetchMore === null || fetchMore === void 0 ? void 0 : fetchMore.pageParam;
        const isFetchingNextPage = (fetchMore === null || fetchMore === void 0 ? void 0 : fetchMore.direction) === 'forward';
        const isFetchingPreviousPage = (fetchMore === null || fetchMore === void 0 ? void 0 : fetchMore.direction) === 'backward';
        const oldPages = (this.state.data || []);
        const oldPageParams = this.state.pageParams || [];
        let newPageParams = oldPageParams;
        // Create function to fetch a page
        const fetchPage = (pages, manual, param, previous) => {
            if (typeof param === 'undefined' && !manual && pages.length) {
                return Promise.resolve(pages);
            }
            return Promise.resolve()
                .then(() => queryFn(...params, param))
                .then(page => {
                newPageParams = previous
                    ? [param, ...newPageParams]
                    : [...newPageParams, param];
                return previous ? [page, ...pages] : [...pages, page];
            });
        };
        // Create function to fetch the data
        const fetchData = () => {
            // Reset new page params
            newPageParams = oldPageParams;
            // Fetch first page?
            if (!oldPages.length) {
                return fetchPage([]);
            }
            // Fetch next page?
            if (isFetchingNextPage) {
                const manual = typeof pageParam !== 'undefined';
                const param = manual ? pageParam : getNextPageParam(options, oldPages);
                return fetchPage(oldPages, manual, param);
            }
            // Fetch previous page?
            if (isFetchingPreviousPage) {
                const manual = typeof pageParam !== 'undefined';
                const param = manual
                    ? pageParam
                    : getPreviousPageParam(options, oldPages);
                return fetchPage(oldPages, manual, param, true);
            }
            // Refetch pages
            newPageParams = [];
            const manual = typeof options.getNextPageParam === 'undefined';
            // Fetch first page
            let promise = fetchPage([], manual, oldPageParams[0]);
            // Fetch remaining pages
            for (let i = 1; i < oldPages.length; i++) {
                promise = promise.then(pages => {
                    const param = manual
                        ? oldPageParams[i]
                        : getNextPageParam(options, pages);
                    return fetchPage(pages, manual, param);
                });
            }
            return promise;
        };
        // Set to fetching state if not already in it
        if (!this.state.isFetching ||
            this.state.isFetchingNextPage !== isFetchingNextPage ||
            this.state.isFetchingPreviousPage !== isFetchingPreviousPage) {
            this.dispatch({
                type: 'fetch',
                isFetchingNextPage,
                isFetchingPreviousPage,
            });
        }
        // Try to get the data
        return this.tryFetchData(options, fetchData).then(data => this.setData(data, { pageParams: newPageParams }));
    }
    tryFetchData(options, fn) {
        return new Promise((outerResolve, outerReject) => {
            let resolved = false;
            let continueLoop;
            let cancelTransport;
            const done = () => {
                resolved = true;
                delete this.cancelFetch;
                delete this.continueFetch;
                delete this.isTransportCancelable;
                // End loop if currently paused
                continueLoop === null || continueLoop === void 0 ? void 0 : continueLoop();
            };
            const resolve = (value) => {
                done();
                outerResolve(value);
            };
            const reject = (value) => {
                done();
                outerReject(value);
            };
            // Create callback to cancel this fetch
            this.cancelFetch = cancelOptions => {
                reject(new utils_1.CancelledError(cancelOptions));
                cancelTransport === null || cancelTransport === void 0 ? void 0 : cancelTransport();
            };
            // Create callback to continue this fetch
            this.continueFetch = () => {
                continueLoop === null || continueLoop === void 0 ? void 0 : continueLoop();
            };
            // Create loop function
            const run = () => {
                // Do nothing if already resolved
                if (resolved) {
                    return;
                }
                let promiseOrValue;
                // Execute query
                try {
                    promiseOrValue = fn();
                }
                catch (error) {
                    promiseOrValue = Promise.reject(error);
                }
                // Check if the transport layer support cancellation
                if (utils_1.isCancelable(promiseOrValue)) {
                    cancelTransport = () => {
                        try {
                            promiseOrValue.cancel();
                        }
                        catch (_a) { }
                    };
                    this.isTransportCancelable = true;
                }
                Promise.resolve(promiseOrValue)
                    .then(data => {
                    // Resolve with data
                    resolve(data);
                })
                    .catch(error => {
                    var _a, _b;
                    // Stop if the fetch is already resolved
                    if (resolved) {
                        return;
                    }
                    // Do we need to retry the request?
                    const { failureCount } = this.state;
                    const retry = (_a = options.retry) !== null && _a !== void 0 ? _a : 3;
                    const retryDelay = (_b = options.retryDelay) !== null && _b !== void 0 ? _b : utils_1.defaultRetryDelay;
                    const shouldRetry = retry === true ||
                        (typeof retry === 'number' && failureCount < retry) ||
                        (typeof retry === 'function' && retry(failureCount, error));
                    if (!shouldRetry) {
                        // We are done if the query does not need to be retried
                        reject(error);
                        return;
                    }
                    // Increase the failureCount
                    this.dispatch({ type: 'failed' });
                    // Delay
                    utils_1.sleep(utils_1.functionalUpdate(retryDelay, failureCount) || 0)
                        // Pause if needed
                        .then(() => {
                        // Pause retry if the document is not visible or when the device is offline
                        if (!utils_1.isDocumentVisible() || !utils_1.isOnline()) {
                            return new Promise(continueResolve => {
                                continueLoop = continueResolve;
                            });
                        }
                    })
                        // Try again
                        .then(run);
                });
            };
            // Start loop
            run();
        });
    }
}
exports.Query = Query;
function defaultQueryFn() {
    return Promise.reject();
}
function getNextPageParam(options, pages) {
    var _a;
    return (_a = options.getNextPageParam) === null || _a === void 0 ? void 0 : _a.call(options, pages[pages.length - 1], pages);
}
function getPreviousPageParam(options, pages) {
    var _a;
    return (_a = options.getPreviousPageParam) === null || _a === void 0 ? void 0 : _a.call(options, pages[0], pages);
}
/**
 * Checks if there is a next page.
 * Returns `undefined` if it cannot be determined.
 */
function hasNextPage(options, pages) {
    return options.getNextPageParam && Array.isArray(pages)
        ? typeof getNextPageParam(options, pages) !== 'undefined'
        : undefined;
}
/**
 * Checks if there is a previous page.
 * Returns `undefined` if it cannot be determined.
 */
function hasPreviousPage(options, pages) {
    return options.getPreviousPageParam && Array.isArray(pages)
        ? typeof getPreviousPageParam(options, pages) !== 'undefined'
        : undefined;
}
function getDefaultState(options) {
    const data = typeof options.initialData === 'function'
        ? options.initialData()
        : options.initialData;
    const hasData = typeof data !== 'undefined';
    return {
        data,
        dataUpdateCount: 0,
        error: null,
        errorUpdateCount: 0,
        failureCount: 0,
        hasNextPage: hasNextPage(options, data),
        hasPreviousPage: hasPreviousPage(options, data),
        isFetching: false,
        isFetchingNextPage: false,
        isFetchingPreviousPage: false,
        isInvalidated: false,
        pageParams: undefined,
        status: hasData ? 'success' : 'idle',
        updatedAt: hasData ? Date.now() : 0,
    };
}
function queryReducer(state, action) {
    var _a;
    switch (action.type) {
        case 'failed':
            return Object.assign(Object.assign({}, state), { failureCount: state.failureCount + 1 });
        case 'fetch':
            return Object.assign(Object.assign({}, state), { failureCount: 0, isFetching: true, isFetchingNextPage: action.isFetchingNextPage || false, isFetchingPreviousPage: action.isFetchingPreviousPage || false, status: state.updatedAt ? 'success' : 'loading' });
        case 'success':
            return Object.assign(Object.assign({}, state), { data: action.data, dataUpdateCount: state.dataUpdateCount + 1, error: null, failureCount: 0, hasNextPage: action.hasNextPage, hasPreviousPage: action.hasPreviousPage, pageParams: action.pageParams, isFetching: false, isFetchingNextPage: false, isFetchingPreviousPage: false, isInvalidated: false, status: 'success', updatedAt: (_a = action.updatedAt) !== null && _a !== void 0 ? _a : Date.now() });
        case 'error':
            const error = action.error;
            if (utils_1.isCancelledError(error) && error.revert) {
                return Object.assign(Object.assign({}, state), { failureCount: 0, isFetching: false, isFetchingNextPage: false, isFetchingPreviousPage: false, status: state.error ? 'error' : state.updatedAt ? 'success' : 'idle' });
            }
            return Object.assign(Object.assign({}, state), { error: error, errorUpdateCount: state.errorUpdateCount + 1, failureCount: state.failureCount + 1, isFetching: false, isFetchingNextPage: false, isFetchingPreviousPage: false, status: 'error' });
        case 'invalidate':
            return Object.assign(Object.assign({}, state), { isInvalidated: true });
        default:
            return state;
    }
}
