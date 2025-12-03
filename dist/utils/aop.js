"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
const logger_1 = require("./logger");
function Log() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const className = target.constructor.name;
            logger_1.Logger.info(`[AOP] Entering ${className}.${propertyKey} with args: ${JSON.stringify(args)}`);
            const start = Date.now();
            try {
                const result = await originalMethod.apply(this, args);
                const end = Date.now();
                logger_1.Logger.info(`[AOP] Exiting ${className}.${propertyKey} - Execution time: ${end - start}ms`);
                return result;
            }
            catch (error) {
                const end = Date.now();
                logger_1.Logger.error(`[AOP] Error in ${className}.${propertyKey} - Execution time: ${end - start}ms - Error: ${error.message}`);
                throw error;
            }
        };
        return descriptor;
    };
}
