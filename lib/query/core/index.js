"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isError = exports.isCancelledError = exports.hashQueryKey = exports.setOnlineHandler = exports.setFocusHandler = exports.setLogger = exports.setNotifyFn = exports.setBatchNotifyFn = exports.QueryClient = exports.QueryCache = void 0;
var queryCache_1 = require("./queryCache");
Object.defineProperty(exports, "QueryCache", { enumerable: true, get: function () { return queryCache_1.QueryCache; } });
var queryClient_1 = require("./queryClient");
Object.defineProperty(exports, "QueryClient", { enumerable: true, get: function () { return queryClient_1.QueryClient; } });
var notifyManager_1 = require("./notifyManager");
Object.defineProperty(exports, "setBatchNotifyFn", { enumerable: true, get: function () { return notifyManager_1.setBatchNotifyFn; } });
Object.defineProperty(exports, "setNotifyFn", { enumerable: true, get: function () { return notifyManager_1.setNotifyFn; } });
var logger_1 = require("./logger");
Object.defineProperty(exports, "setLogger", { enumerable: true, get: function () { return logger_1.setLogger; } });
var focusHandler_1 = require("./focusHandler");
Object.defineProperty(exports, "setFocusHandler", { enumerable: true, get: function () { return focusHandler_1.setFocusHandler; } });
var onlineHandler_1 = require("./onlineHandler");
Object.defineProperty(exports, "setOnlineHandler", { enumerable: true, get: function () { return onlineHandler_1.setOnlineHandler; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "hashQueryKey", { enumerable: true, get: function () { return utils_1.hashQueryKey; } });
Object.defineProperty(exports, "isCancelledError", { enumerable: true, get: function () { return utils_1.isCancelledError; } });
Object.defineProperty(exports, "isError", { enumerable: true, get: function () { return utils_1.isError; } });
// Types
__exportStar(require("./types"), exports);
