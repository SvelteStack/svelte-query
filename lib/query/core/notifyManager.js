"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyManager = exports.setBatchNotifyFn = exports.setNotifyFn = void 0;
const utils_1 = require("./utils");
// GETTERS AND SETTERS
// Default to a dummy "notify" implementation that just runs the callback
let notifyFn = (callback) => {
    callback();
};
// Default to a dummy "batch notify" implementation that just runs the callback
let batchNotifyFn = (callback) => {
    callback();
};
/**
 * Use this function to set a custom notify function.
 * This can be used to for example wrap notifications with `React.act` while running tests.
 */
function setNotifyFn(fn) {
    notifyFn = fn;
}
exports.setNotifyFn = setNotifyFn;
/**
 * Use this function to set a custom function to batch notifications together into a single tick.
 * By default React Query will use the batch function provided by ReactDOM or React Native.
 */
function setBatchNotifyFn(fn) {
    batchNotifyFn = fn;
}
exports.setBatchNotifyFn = setBatchNotifyFn;
// CLASS
class NotifyManager {
    constructor() {
        this.queue = [];
        this.transactions = 0;
    }
    batch(callback) {
        this.transactions++;
        const result = callback();
        this.transactions--;
        if (!this.transactions) {
            this.flush();
        }
        return result;
    }
    schedule(callback) {
        if (this.transactions) {
            this.queue.push(callback);
        }
        else {
            utils_1.scheduleMicrotask(() => {
                notifyFn(callback);
            });
        }
    }
    flush() {
        const queue = this.queue;
        this.queue = [];
        if (queue.length) {
            utils_1.scheduleMicrotask(() => {
                batchNotifyFn(() => {
                    queue.forEach(callback => {
                        notifyFn(callback);
                    });
                });
            });
        }
    }
}
// SINGLETON
exports.notifyManager = new NotifyManager();
