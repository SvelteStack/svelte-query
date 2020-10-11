"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./query/core");
const logger_1 = require("./logger");
if (logger_1.logger) {
    core_1.setLogger(logger_1.logger);
}
