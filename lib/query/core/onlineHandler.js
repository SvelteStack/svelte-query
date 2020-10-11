"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOnlineHandler = exports.setOnlineHandler = void 0;
const utils_1 = require("./utils");
let onlineCallback = utils_1.noop;
let removePreviousHandler;
function setOnlineHandler(callback) {
    if (removePreviousHandler) {
        removePreviousHandler();
    }
    removePreviousHandler = callback(() => {
        onlineCallback();
    });
}
exports.setOnlineHandler = setOnlineHandler;
function initOnlineHandler(callback) {
    // Set the callback to execute on online
    onlineCallback = callback;
    // Set a default focus handler if needed
    if (!removePreviousHandler) {
        setOnlineHandler(handleOnline => {
            if (!utils_1.isServer && (window === null || window === void 0 ? void 0 : window.addEventListener)) {
                // Listen to online
                window.addEventListener('online', handleOnline, false);
                return () => {
                    // Be sure to unsubscribe if a new handler is set
                    window.removeEventListener('online', handleOnline);
                };
            }
        });
    }
}
exports.initOnlineHandler = initOnlineHandler;
