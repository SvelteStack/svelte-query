"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogger = exports.getLogger = void 0;
const utils_1 = require("./utils");
// FUNCTIONS
let logger = console || {
    error: utils_1.noop,
    warn: utils_1.noop,
    log: utils_1.noop,
};
function getLogger() {
    return logger;
}
exports.getLogger = getLogger;
function setLogger(c) {
    logger = c;
}
exports.setLogger = setLogger;
