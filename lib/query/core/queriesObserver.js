"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueriesObserver = void 0;
const utils_1 = require("./utils");
const notifyManager_1 = require("./notifyManager");
class QueriesObserver {
    constructor(config) {
        this.client = config.client;
        this.queries = config.queries || [];
        this.result = [];
        this.observers = [];
        this.listeners = [];
        // Subscribe to queries
        this.updateObservers();
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
        this.observers.forEach(observer => {
            observer.subscribe(result => {
                this.onUpdate(observer, result);
            });
        });
    }
    clear() {
        this.listeners = [];
        this.observers.forEach(observer => {
            observer.clear();
        });
    }
    setQueries(queries) {
        this.queries = queries;
        this.updateObservers();
    }
    getCurrentResult() {
        return this.result;
    }
    updateObservers() {
        let hasIndexChange = false;
        const prevObservers = this.observers;
        const newObservers = this.queries.map((options, i) => {
            let observer = prevObservers[i];
            const defaultedOptions = this.client.defaultQueryObserverOptions(options);
            const hashFn = utils_1.getQueryKeyHashFn(defaultedOptions);
            defaultedOptions.queryHash = hashFn(defaultedOptions.queryKey);
            if (!observer ||
                observer.getCurrentQuery().queryHash !== defaultedOptions.queryHash) {
                hasIndexChange = true;
                observer = prevObservers.find(x => x.getCurrentQuery().queryHash === defaultedOptions.queryHash);
            }
            if (observer) {
                observer.setOptions(defaultedOptions);
                return observer;
            }
            return this.client.watchQuery(defaultedOptions);
        });
        if (prevObservers.length === newObservers.length && !hasIndexChange) {
            return;
        }
        this.observers = newObservers;
        this.result = newObservers.map(observer => observer.getCurrentResult());
        if (!this.listeners.length) {
            return;
        }
        utils_1.difference(prevObservers, newObservers).forEach(observer => {
            observer.clear();
        });
        utils_1.difference(newObservers, prevObservers).forEach(observer => {
            observer.subscribe(result => {
                this.onUpdate(observer, result);
            });
        });
        this.notify();
    }
    onUpdate(observer, result) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.result = utils_1.replaceAt(this.result, index, result);
            this.notify();
        }
    }
    notify() {
        const { result, listeners } = this;
        notifyManager_1.notifyManager.batch(() => {
            listeners.forEach(listener => {
                notifyManager_1.notifyManager.schedule(() => {
                    listener(result);
                });
            });
        });
    }
}
exports.QueriesObserver = QueriesObserver;
