"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleMicrotask = exports.getStatusProps = exports.sleep = exports.isCancelledError = exports.isError = exports.isCancelable = exports.isQueryKey = exports.isPlainObject = exports.shallowEqualObjects = exports.replaceEqualDeep = exports.partialDeepEqual = exports.stableValueHash = exports.hashQueryKey = exports.getQueryKeyHashFn = exports.matchQuery = exports.parseFilterArgs = exports.parseQueryArgs = exports.timeUntilStale = exports.replaceAt = exports.difference = exports.uniq = exports.ensureArray = exports.isOnline = exports.isDocumentVisible = exports.isValidTimeout = exports.defaultRetryDelay = exports.functionalUpdate = exports.noop = exports.isServer = exports.CancelledError = void 0;
class CancelledError {
    constructor(options) {
        this.revert = options === null || options === void 0 ? void 0 : options.revert;
        this.silent = options === null || options === void 0 ? void 0 : options.silent;
    }
}
exports.CancelledError = CancelledError;
// UTILS
exports.isServer = typeof window === 'undefined';
function noop() {
    return undefined;
}
exports.noop = noop;
function functionalUpdate(updater, input) {
    return typeof updater === 'function'
        ? updater(input)
        : updater;
}
exports.functionalUpdate = functionalUpdate;
function defaultRetryDelay(attempt) {
    return Math.min(1000 * 2 ** attempt, 30000);
}
exports.defaultRetryDelay = defaultRetryDelay;
function isValidTimeout(value) {
    return typeof value === 'number' && value >= 0 && value !== Infinity;
}
exports.isValidTimeout = isValidTimeout;
function isDocumentVisible() {
    // document global can be unavailable in react native
    if (typeof document === 'undefined') {
        return true;
    }
    return [undefined, 'visible', 'prerender'].includes(document.visibilityState);
}
exports.isDocumentVisible = isDocumentVisible;
function isOnline() {
    return navigator.onLine === undefined || navigator.onLine;
}
exports.isOnline = isOnline;
function ensureArray(value) {
    return Array.isArray(value) ? value : [value];
}
exports.ensureArray = ensureArray;
function uniq(array) {
    return array.filter((value, i) => array.indexOf(value) === i);
}
exports.uniq = uniq;
function difference(array1, array2) {
    return array1.filter(x => array2.indexOf(x) === -1);
}
exports.difference = difference;
function replaceAt(array, index, value) {
    const copy = array.slice(0);
    copy[index] = value;
    return copy;
}
exports.replaceAt = replaceAt;
function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
exports.timeUntilStale = timeUntilStale;
function parseQueryArgs(arg1, arg2, arg3) {
    if (!isQueryKey(arg1)) {
        return arg1;
    }
    if (typeof arg2 === 'function') {
        return Object.assign(Object.assign({}, arg3), { queryKey: arg1, queryFn: arg2 });
    }
    return Object.assign(Object.assign({}, arg2), { queryKey: arg1 });
}
exports.parseQueryArgs = parseQueryArgs;
function parseFilterArgs(arg1, arg2, arg3) {
    return (isQueryKey(arg1)
        ? [Object.assign(Object.assign({}, arg2), { queryKey: arg1 }), arg3]
        : [arg1 || {}, arg2]);
}
exports.parseFilterArgs = parseFilterArgs;
function matchQuery(filters, query) {
    const { active, exact, fetching, fresh, inactive, predicate, queryKey, stale, } = filters;
    if (isQueryKey(queryKey)) {
        if (exact) {
            const hashFn = getQueryKeyHashFn(query.options);
            if (query.queryHash !== hashFn(queryKey)) {
                return false;
            }
        }
        else if (!partialDeepEqual(ensureArray(query.queryKey), ensureArray(queryKey))) {
            return false;
        }
    }
    let isActive;
    if (inactive === false || (active && !inactive)) {
        isActive = true;
    }
    else if (active === false || (inactive && !active)) {
        isActive = false;
    }
    if (typeof isActive === 'boolean' && query.isActive() !== isActive) {
        return false;
    }
    let isStale;
    if (fresh === false || (stale && !fresh)) {
        isStale = true;
    }
    else if (stale === false || (fresh && !stale)) {
        isStale = false;
    }
    if (typeof isStale === 'boolean' && query.isStale() !== isStale) {
        return false;
    }
    if (typeof fetching === 'boolean' && query.isFetching() !== fetching) {
        return false;
    }
    if (predicate && !predicate(query)) {
        return false;
    }
    return true;
}
exports.matchQuery = matchQuery;
function getQueryKeyHashFn(options) {
    return (options === null || options === void 0 ? void 0 : options.queryKeyHashFn) || hashQueryKey;
}
exports.getQueryKeyHashFn = getQueryKeyHashFn;
/**
 * Default query keys hash function.
 */
function hashQueryKey(queryKey) {
    return stableValueHash(queryKey);
}
exports.hashQueryKey = hashQueryKey;
/**
 * Hashes the value into a stable hash.
 */
function stableValueHash(value) {
    return JSON.stringify(value, (_, val) => isPlainObject(val)
        ? Object.keys(val)
            .sort()
            .reduce((result, key) => {
            result[key] = val[key];
            return result;
        }, {})
        : val);
}
exports.stableValueHash = stableValueHash;
/**
 * Checks if `b` partially matches with `a`.
 */
function partialDeepEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (typeof a === 'object') {
        return !Object.keys(b).some(key => !partialDeepEqual(a[key], b[key]));
    }
    return false;
}
exports.partialDeepEqual = partialDeepEqual;
function replaceEqualDeep(a, b) {
    if (a === b) {
        return a;
    }
    const array = Array.isArray(a) && Array.isArray(b);
    if (array || (isPlainObject(a) && isPlainObject(b))) {
        const aSize = array ? a.length : Object.keys(a).length;
        const bItems = array ? b : Object.keys(b);
        const bSize = bItems.length;
        const copy = array ? [] : {};
        let equalItems = 0;
        for (let i = 0; i < bSize; i++) {
            const key = array ? i : bItems[i];
            copy[key] = replaceEqualDeep(a[key], b[key]);
            if (copy[key] === a[key]) {
                equalItems++;
            }
        }
        return aSize === bSize && equalItems === aSize ? a : copy;
    }
    return b;
}
exports.replaceEqualDeep = replaceEqualDeep;
/**
 * Shallow compare objects. Only works with objects that always have the same properties.
 */
function shallowEqualObjects(a, b) {
    for (const key in a) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
exports.shallowEqualObjects = shallowEqualObjects;
// Copied from: https://github.com/jonschlinkert/is-plain-object
function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
        return false;
    }
    // If has modified constructor
    const ctor = o.constructor;
    if (typeof ctor === 'undefined') {
        return true;
    }
    // If has modified prototype
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) {
        return false;
    }
    // If constructor does not have an Object-specific method
    if (!prot.hasOwnProperty('isPrototypeOf')) {
        return false;
    }
    // Most likely a plain Object
    return true;
}
exports.isPlainObject = isPlainObject;
function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}
function isQueryKey(value) {
    return typeof value === 'string' || Array.isArray(value);
}
exports.isQueryKey = isQueryKey;
function isCancelable(value) {
    return typeof (value === null || value === void 0 ? void 0 : value.cancel) === 'function';
}
exports.isCancelable = isCancelable;
function isError(value) {
    return value instanceof Error;
}
exports.isError = isError;
function isCancelledError(value) {
    return value instanceof CancelledError;
}
exports.isCancelledError = isCancelledError;
function sleep(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
exports.sleep = sleep;
function getStatusProps(status) {
    return {
        status,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        isIdle: status === 'idle',
    };
}
exports.getStatusProps = getStatusProps;
/**
 * Schedules a microtask.
 * This can be useful to schedule state updates after rendering.
 */
function scheduleMicrotask(callback) {
    Promise.resolve()
        .then(callback)
        .catch(error => setTimeout(() => {
        throw error;
    }));
}
exports.scheduleMicrotask = scheduleMicrotask;
