"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryClient = void 0;
const utils_1 = require("./utils");
const queriesObserver_1 = require("./queriesObserver");
const queryObserver_1 = require("./queryObserver");
const focusHandler_1 = require("./focusHandler");
const onlineHandler_1 = require("./onlineHandler");
const notifyManager_1 = require("./notifyManager");
// CLASS
class QueryClient {
    constructor(config) {
        this.cache = config.cache;
        this.defaultOptions = config.defaultOptions || {};
    }
    getDefaultOptions() {
        return this.defaultOptions;
    }
    setDefaultOptions(options) {
        this.defaultOptions = options;
    }
    mount() {
        mountedClients.push(this);
        focusHandler_1.initFocusHandler(onFocus);
        onlineHandler_1.initOnlineHandler(onOnline);
    }
    unmount() {
        const index = mountedClients.indexOf(this);
        if (index > -1) {
            mountedClients.splice(index, 1);
        }
    }
    isFetching(arg1, arg2) {
        const [filters] = utils_1.parseFilterArgs(arg1, arg2);
        filters.fetching = true;
        return this.cache.findAll(filters).length;
    }
    setQueryDefaults(arg1, arg2, arg3) {
        const parsedOptions = utils_1.parseQueryArgs(arg1, arg2, arg3);
        const defaultedOptions = this.defaultQueryOptions(parsedOptions);
        this.cache.build(defaultedOptions).setDefaultOptions(defaultedOptions);
    }
    getQueryData(queryKey, filters) {
        var _a;
        return (_a = this.cache.find(queryKey, filters)) === null || _a === void 0 ? void 0 : _a.state.data;
    }
    setQueryData(queryKey, updater, options) {
        const parsedOptions = utils_1.parseQueryArgs(queryKey);
        const defaultedOptions = this.defaultQueryOptions(parsedOptions);
        return this.cache.build(defaultedOptions).setData(updater, options);
    }
    getQueryState(queryKey, filters) {
        var _a;
        return (_a = this.cache.find(queryKey, filters)) === null || _a === void 0 ? void 0 : _a.state;
    }
    removeQueries(arg1, arg2) {
        notifyManager_1.notifyManager.batch(() => {
            this.cache.findAll(arg1, arg2).forEach(query => {
                this.cache.remove(query);
            });
        });
    }
    cancelQueries(arg1, arg2, arg3) {
        const [filters, options] = utils_1.parseFilterArgs(arg1, arg2, arg3);
        const cancelOptions = options || {};
        if (typeof cancelOptions.revert === 'undefined') {
            cancelOptions.revert = true;
        }
        const promises = notifyManager_1.notifyManager.batch(() => this.cache.findAll(filters).map(query => query.cancel(cancelOptions)));
        return Promise.all(promises).then(utils_1.noop).catch(utils_1.noop);
    }
    invalidateQueries(arg1, arg2, arg3) {
        var _a, _b;
        const [filters, options] = utils_1.parseFilterArgs(arg1, arg2, arg3);
        const refetchFilters = Object.assign(Object.assign({}, filters), { active: (_a = filters.refetchActive) !== null && _a !== void 0 ? _a : true, inactive: (_b = filters.refetchInactive) !== null && _b !== void 0 ? _b : false });
        return notifyManager_1.notifyManager.batch(() => {
            this.cache.findAll(filters).forEach(query => {
                query.invalidate();
            });
            return this.refetchQueries(refetchFilters, options);
        });
    }
    refetchQueries(arg1, arg2, arg3) {
        const [filters, options] = utils_1.parseFilterArgs(arg1, arg2, arg3);
        const promises = notifyManager_1.notifyManager.batch(() => this.cache.findAll(filters).map(query => query.fetch()));
        let promise = Promise.all(promises).then(utils_1.noop);
        if (!(options === null || options === void 0 ? void 0 : options.throwOnError)) {
            promise = promise.catch(utils_1.noop);
        }
        return promise;
    }
    watchQuery(arg1, arg2, arg3) {
        const parsedOptions = utils_1.parseQueryArgs(arg1, arg2, arg3);
        return new queryObserver_1.QueryObserver({ client: this, options: parsedOptions });
    }
    watchQueries(queries) {
        return new queriesObserver_1.QueriesObserver({ client: this, queries });
    }
    fetchQueryData(arg1, arg2, arg3) {
        const parsedOptions = utils_1.parseQueryArgs(arg1, arg2, arg3);
        // https://github.com/tannerlinsley/react-query/issues/652
        if (typeof parsedOptions.retry === 'undefined') {
            parsedOptions.retry = false;
        }
        const defaultedOptions = this.defaultQueryOptions(parsedOptions);
        let query = this.cache.find(defaultedOptions.queryKey);
        if (!query) {
            query = this.cache.build(defaultedOptions);
        }
        else if (!query.isStaleByTime(defaultedOptions.staleTime)) {
            return Promise.resolve(query.state.data);
        }
        return query.fetch(defaultedOptions);
    }
    prefetchQuery(arg1, arg2, arg3) {
        return this.fetchQueryData(arg1, arg2, arg3)
            .then(utils_1.noop)
            .catch(utils_1.noop);
    }
    getCache() {
        return this.cache;
    }
    defaultQueryOptions(options) {
        return Object.assign(Object.assign({}, this.defaultOptions.queries), options);
    }
    defaultQueryObserverOptions(options) {
        return Object.assign(Object.assign({}, this.defaultOptions.queries), options);
    }
    defaultMutationOptions(options) {
        return Object.assign(Object.assign({}, this.defaultOptions.mutations), options);
    }
}
exports.QueryClient = QueryClient;
const mountedClients = [];
function onFocus() {
    onExternalEvent('focus');
}
function onOnline() {
    onExternalEvent('online');
}
function onExternalEvent(type) {
    if (utils_1.isDocumentVisible() && utils_1.isOnline()) {
        notifyManager_1.notifyManager.batch(() => {
            utils_1.uniq(mountedClients.map(x => x.getCache())).forEach(cache => {
                cache.getAll().forEach(query => {
                    if (type === 'focus') {
                        query.onFocus();
                    }
                    else {
                        query.onOnline();
                    }
                });
            });
        });
    }
}
