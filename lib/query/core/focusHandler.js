"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFocusHandler = exports.setFocusHandler = void 0;
const utils_1 = require("./utils");
let focusCallback = utils_1.noop;
let removePreviousHandler;
function setFocusHandler(callback) {
    if (removePreviousHandler) {
        removePreviousHandler();
    }
    removePreviousHandler = callback(() => {
        focusCallback();
    });
}
exports.setFocusHandler = setFocusHandler;
function initFocusHandler(callback) {
    // Set the callback to execute on focus
    focusCallback = callback;
    // Set a default focus handler if needed
    if (!removePreviousHandler)
        setFocusHandler(handleFocus => {
            if (!utils_1.isServer && (window === null || window === void 0 ? void 0 : window.addEventListener)) {
                // Listen to visibillitychange and focus
                window.addEventListener('visibilitychange', handleFocus, false);
                window.addEventListener('focus', handleFocus, false);
                return () => {
                    // Be sure to unsubscribe if a new handler is set
                    window.removeEventListener('visibilitychange', handleFocus);
                    window.removeEventListener('focus', handleFocus);
                };
            }
        });
}
exports.initFocusHandler = initFocusHandler;
