import { Logger } from './logger';

export function Log() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const className = target.constructor.name;
            Logger.info(`[AOP] Entering ${className}.${propertyKey} with args: ${JSON.stringify(args)}`);
            const start = Date.now();

            try {
                const result = await originalMethod.apply(this, args);
                const end = Date.now();
                Logger.info(`[AOP] Exiting ${className}.${propertyKey} - Execution time: ${end - start}ms`);
                return result;
            } catch (error: any) {
                const end = Date.now();
                Logger.error(`[AOP] Error in ${className}.${propertyKey} - Execution time: ${end - start}ms - Error: ${error.message}`);
                throw error;
            }
        };

        return descriptor;
    };
}
