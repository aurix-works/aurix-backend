"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const database_1 = require("./config/database");
const startServer = async () => {
    try {
        // Connect to Databases
        await (0, database_1.connectMySQL)();
        await (0, database_1.connectMongoDB)();
        // Redis connects automatically on import
        app_1.default.listen(config_1.config.port, () => {
            logger_1.Logger.info(`Server running on port ${config_1.config.port}`);
            logger_1.Logger.info(`Environment: ${config_1.config.nodeEnv}`);
        });
    }
    catch (error) {
        logger_1.Logger.error('Failed to start server', error);
        process.exit(1);
    }
};
startServer();
